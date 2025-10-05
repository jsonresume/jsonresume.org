import { FoundationsContent } from './history/FoundationsContent';
import { TechnicalContent } from './history/TechnicalContent';
import { EcosystemContent } from './history/EcosystemContent';

export function HistorySection() {
  return (
    <div className="col-sm-12">
      <h2>History</h2>
      <FoundationsContent />
      <TechnicalContent />
      <EcosystemContent />
    </div>
  );
}
