'use client';

import type { RegisterStep } from './page';
import { StudentRegisterFlow, UnternehmenRegisterFlow } from './forms';

type RegisterMode = 'schueler' | 'unternehmen';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onStepChange: (step: RegisterStep) => void;
  currentHeading: React.ReactNode;
  mode?: RegisterMode;
}

export function RegisterForm({
  onSwitchToLogin,
  onStepChange,
  currentHeading,
  mode = 'schueler',
}: RegisterFormProps) {
  if (mode === 'unternehmen') {
    return (
      <UnternehmenRegisterFlow
        onSwitchToLogin={onSwitchToLogin}
        onStepChange={onStepChange}
        currentHeading={currentHeading}
      />
    );
  }

  return (
    <StudentRegisterFlow
      onSwitchToLogin={onSwitchToLogin}
      onStepChange={onStepChange}
      currentHeading={currentHeading}
    />
  );
}
