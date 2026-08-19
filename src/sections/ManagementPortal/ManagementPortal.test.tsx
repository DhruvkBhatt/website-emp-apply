import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithState } from '@/test/renderWithState';
import { ManagementPortal } from '@/sections/ManagementPortal/ManagementPortal';
import { management, managementGate } from '@/content';
import { sha256Hex } from '@/state/gate';

const noop = () => {};

describe('ManagementPortal — the passphrase gate (§5.5)', () => {
  it('shows the gate, not the decision buttons, when locked', () => {
    renderWithState(<ManagementPortal onAccepted={noop} />, { applicationSubmitted: true });
    expect(screen.getByLabelText(managementGate.prompt)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: management.accept })).not.toBeInTheDocument();
  });

  it('renders the configured hint, falling back to the default', () => {
    renderWithState(<ManagementPortal onAccepted={noop} />);
    expect(screen.getByText(new RegExp(managementGate.defaultHint))).toBeInTheDocument();
  });

  it('keeps the submit button disabled until something is typed', async () => {
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />);
    const submit = screen.getByRole('button', { name: managementGate.submit });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(managementGate.prompt), 'x');
    expect(submit).toBeEnabled();
  });

  it('rejects the wrong passphrase and announces it', async () => {
    vi.stubEnv('VITE_MANAGEMENT_PASSPHRASE_HASH', await sha256Hex('mogra'));
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />);

    await user.type(screen.getByLabelText(managementGate.prompt), 'wrong');
    await user.click(screen.getByRole('button', { name: managementGate.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(managementGate.wrong);
    expect(screen.getByLabelText(managementGate.prompt)).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('unlocks on the right passphrase, case and whitespace insensitively', async () => {
    vi.stubEnv('VITE_MANAGEMENT_PASSPHRASE_HASH', await sha256Hex('mogra'));
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />, {
      applicationSubmitted: true,
    });

    await user.type(screen.getByLabelText(managementGate.prompt), '  MoGrA  ');
    await user.click(screen.getByRole('button', { name: managementGate.submit }));

    expect(await screen.findByRole('button', { name: management.accept })).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('fails open but warns loudly when no hash is configured', async () => {
    vi.stubEnv('VITE_MANAGEMENT_PASSPHRASE_HASH', '');
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />);

    await user.type(screen.getByLabelText(managementGate.prompt), 'literally anything');
    await user.click(screen.getByRole('button', { name: managementGate.submit }));

    expect(await screen.findByText(managementGate.unconfigured)).toBeInTheDocument();
    vi.unstubAllEnvs();
  });
});

describe('ManagementPortal — the decision', () => {
  it('offers nothing to decide before submission', () => {
    renderWithState(<ManagementPortal onAccepted={noop} />, { managementUnlocked: true });
    expect(screen.getByText(management.notSubmitted)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: management.accept })).not.toBeInTheDocument();
  });

  it('records acceptance and fires the acceptance screen', async () => {
    const onAccepted = vi.fn();
    const { user } = renderWithState(<ManagementPortal onAccepted={onAccepted} />, {
      applicationSubmitted: true,
      managementUnlocked: true,
    });

    await user.click(screen.getByRole('button', { name: management.accept }));

    expect(onAccepted).toHaveBeenCalledOnce();
    expect(await screen.findByText(management.decided.accepted)).toBeInTheDocument();
  });

  it('records the clarification path without pretending it worked (§10.5)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />, {
      applicationSubmitted: true,
      managementUnlocked: true,
    });

    await user.click(screen.getByRole('button', { name: management.clarify }));

    expect(await screen.findByText(management.decided.clarification)).toBeInTheDocument();
    // No number configured in tests, so no window.open and an honest fallback.
    expect(open).not.toHaveBeenCalled();
    expect(screen.getByText(management.clarifyFallback)).toBeInTheDocument();
    open.mockRestore();
  });

  it('opens a WhatsApp deep link when a number is configured', async () => {
    vi.stubEnv('VITE_CLARIFICATION_WHATSAPP', '+91 90000 00000');
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />, {
      applicationSubmitted: true,
      managementUnlocked: true,
    });

    await user.click(screen.getByRole('button', { name: management.clarify }));

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/919000000000?text='),
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
    vi.unstubAllEnvs();
  });

  it('can be re-locked', async () => {
    const { user } = renderWithState(<ManagementPortal onAccepted={noop} />, {
      managementUnlocked: true,
    });
    await user.click(screen.getByRole('button', { name: managementGate.relock }));
    expect(screen.getByLabelText(managementGate.prompt)).toBeInTheDocument();
  });
});
