import { WizardStep, WizardSteps } from '@syndesis/ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export interface IViewsImportStepsProps {
  /**
   * The one-based active step number.
   */
  step: number;
}

/**
 * A component to display the PatternFly Wizard Steps specific to the import views from data source wizard.
 * @see [step]{@link IViewsImportStepsProps#step}
 * @see [subStep]{@link IViewsImportStepsProps#subStep}
 */
export const ViewsImportSteps: React.FunctionComponent<
  IViewsImportStepsProps
> = props => {
  const { t } = useTranslation(['data']);
  const [active, setActive] = React.useState(false);

  const toggleActive = async () => {
    setActive(!active);
  };

  return (
    <WizardSteps
      active={active}
      mainSteps={
        <>
          <WizardStep
            isActive={props.step === 1}
            isDisabled={props.step < 1}
            onClick={toggleActive}
            step={1}
            title={t('importDataSourceWizardStep1')}
          />
          <WizardStep
            isActive={props.step === 2}
            isDisabled={props.step < 2}
            onClick={toggleActive}
            step={2}
            title={t('importDataSourceWizardStep2')}
          />
        </>
      }
      altSteps={
        <>
          <WizardStep
            isActive={props.step === 1}
            isDisabled={props.step < 1}
            isAlt={true}
            onClick={toggleActive}
            step={1}
            title={t('importDataSourceWizardStep1')}
          />
          <WizardStep
            isActive={props.step === 2}
            isDisabled={props.step < 2}
            isAlt={true}
            onClick={toggleActive}
            step={2}
            title={t('importDataSourceWizardStep2')}
          />
        </>
      }
    />
  );
};
