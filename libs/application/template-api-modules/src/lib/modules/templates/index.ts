import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { InstitutionCollaborationModule } from './institution-collaboration/institution-collaboration.module'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { ChildrenResidenceChangeModule } from './children-residence-change/children-residence-change.module'
import { LoginServiceModule } from './login-service/login-service.module'
import { FundingGovernmentProjectsModule } from './funding-government-projects/funding-government-projects.module'
import { PartyLetterModule } from './party-letter/party-letter.module'
import { PublicDebtPaymentPlanModule } from './public-debt-payment-plan/public-debt-payment-plan.module'

export const modules = [
  ReferenceTemplateModule,
  ParentalLeaveModule,
  DocumentProviderOnboardingModule,
  InstitutionCollaborationModule,
  HealthInsuranceModule,
  ChildrenResidenceChangeModule,
  LoginServiceModule,
  FundingGovernmentProjectsModule,
  PartyLetterModule,
  PublicDebtPaymentPlanModule,
]

export { ReferenceTemplateService } from './reference-template/reference-template.service'
export { ParentalLeaveService } from './parental-leave/parental-leave.service'
export { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
export { InstitutionCollaborationService } from './institution-collaboration/institution-collaboration.service'
export { HealthInsuranceService } from './health-insurance/health-insurance.service'
export { ChildrenResidenceChangeService } from './children-residence-change/children-residence-change.service'
export { LoginServiceService } from './login-service/login-service.service'
export { FundingGovernmentProjectsService } from './funding-government-projects/funding-government-projects.service'
export { PartyLetterService } from './party-letter/party-letter.service'
export { PublicDebtPaymentPlanService } from './public-debt-payment-plan/public-debt-payment-plan.service'
