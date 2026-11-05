import InsuranceApplicationSystem from './ApplicationForm/InsuranceApplicationSystem';

export default function QuoteForm({ defaultType = '' }) {
  return <InsuranceApplicationSystem initialCategory={defaultType} />;
}
