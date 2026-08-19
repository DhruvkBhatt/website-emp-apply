import { useCallback, useEffect, useState } from 'react';
import { useAppState } from '@/state/AppState';
import { useKonami } from '@/hooks/useKonami';
import { MotionToggle } from '@/components/MotionToggle';
import { Footer } from '@/components/Footer';

import { Loader } from '@/sections/Loader/Loader';
import { Hero } from '@/sections/Hero/Hero';
import { ExecutivePitch } from '@/sections/ExecutivePitch/ExecutivePitch';
import { Portfolio } from '@/sections/Portfolio/Portfolio';
import { MeetingNotes } from '@/sections/MeetingNotes/MeetingNotes';
import { Planning777 } from '@/sections/Planning777/Planning777';
import { GetOverHere } from '@/sections/GetOverHere/GetOverHere';
import { BlushLab } from '@/sections/BlushLab/BlushLab';
import { FoodSimulator } from '@/sections/FoodSimulator/FoodSimulator';
import { Compatibility } from '@/sections/Compatibility/Compatibility';
import { WarmthProtocol } from '@/sections/WarmthProtocol/WarmthProtocol';
import { DecisionArchitecture } from '@/sections/DecisionArchitecture/DecisionArchitecture';
import { FinancePhilosophy } from '@/sections/FinancePhilosophy/FinancePhilosophy';
import { JewelryRoadmap } from '@/sections/JewelryRoadmap/JewelryRoadmap';
import { FitnessPlan } from '@/sections/FitnessPlan/FitnessPlan';
import { FamilyIntegration } from '@/sections/FamilyIntegration/FamilyIntegration';
import { CareerSupport } from '@/sections/CareerSupport/CareerSupport';
import { Benefits } from '@/sections/Benefits/Benefits';
import { Exclusivity } from '@/sections/Exclusivity/Exclusivity';
import { CommitmentTimeline } from '@/sections/CommitmentTimeline/CommitmentTimeline';
import { SeriousMessage } from '@/sections/SeriousMessage/SeriousMessage';
import { ApplyNow } from '@/sections/ApplyNow/ApplyNow';
import { ManagementPortal } from '@/sections/ManagementPortal/ManagementPortal';
import { AcceptanceScreen } from '@/sections/AcceptanceScreen/AcceptanceScreen';

/**
 * §2 — section order *is* narrative order, and it lives here and nowhere else.
 * No section imports another, so this list is the only thing to edit when the
 * emotional arc needs rearranging.
 */
export default function App() {
  const { state, dispatch } = useAppState();
  const [showAcceptance, setShowAcceptance] = useState(false);

  // §2 — the 'queen' keystroke unlock.
  useKonami('queen', () => dispatch({ type: 'findEgg', egg: 'queen' }));

  const replayAcceptance = useCallback(() => setShowAcceptance(true), []);

  // Coming back to a page where the offer was already accepted should not
  // ambush her with the overlay — it is opt-in via the hero's 🖤 button.
  useEffect(() => {
    if (!state.hasEntered) setShowAcceptance(false);
  }, [state.hasEntered]);

  return (
    <>
      <Loader />

      {state.hasEntered && (
        <>
          <main>
            <Hero onReplayAcceptance={replayAcceptance} />
            <ExecutivePitch />
            <Portfolio />
            <MeetingNotes />
            <Planning777 />
            <GetOverHere />
            <BlushLab />
            <FoodSimulator />
            <Compatibility />
            <WarmthProtocol />
            <DecisionArchitecture />
            <FinancePhilosophy />
            <JewelryRoadmap />
            <FitnessPlan />
            <FamilyIntegration />
            <CareerSupport />
            <Benefits />
            <Exclusivity />
            <CommitmentTimeline />
            <SeriousMessage />
            <ApplyNow />
            <ManagementPortal onAccepted={replayAcceptance} />
          </main>
          <Footer />
          <MotionToggle />
          <AcceptanceScreen open={showAcceptance} onClose={() => setShowAcceptance(false)} />
        </>
      )}
    </>
  );
}
