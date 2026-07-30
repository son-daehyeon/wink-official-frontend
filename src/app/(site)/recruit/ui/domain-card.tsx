import type { RecruitDomain } from '../model/recruit-domain';

interface DomainCardProps extends RecruitDomain {}

export default function DomainCard({ tag, domain, description }: DomainCardProps) {
  return (
    <div className="flex flex-col w-[300px] min-h-[120px] sm:min-h-[140px] p-4 sm:p-6 border border-neutral-500 rounded-3xl space-y-1 sm:space-y-2 justify-center">
      <h2 className="text-sm sm:text-lg font-medium text-wink-500">{tag}</h2>
      <h2 className="text-sm sm:text-lg font-semibold">{domain}</h2>
      <p className="text-xs sm:text-base">{description}</p>
    </div>
  );
}
