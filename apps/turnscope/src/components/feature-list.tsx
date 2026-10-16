import type { Feature } from '@/lib/content';

const columns = {
  two: 'sm:grid-cols-2',
  three: 'sm:grid-cols-2 lg:grid-cols-3',
};

export function FeatureList({
  features,
  layout,
  titlesAreCode = false,
}: {
  features: Feature[];
  layout: keyof typeof columns;
  titlesAreCode?: boolean;
}) {
  return (
    <ul className={`grid gap-x-10 gap-y-9 ${columns[layout]}`}>
      {features.map((feature) => (
        <li key={feature.title}>
          <h3
            className={
              titlesAreCode
                ? 'font-mono text-[14px]/6 font-medium tracking-normal'
                : 'text-[16px] font-semibold tracking-[-0.01em]'
            }
          >
            {feature.title}
            {feature.tag && (
              <span className="ms-2 font-sans text-[13px] font-normal text-ink-faint">
                {feature.tag}
              </span>
            )}
          </h3>
          <p className="mt-1.5 body-text">{feature.text}</p>
        </li>
      ))}
    </ul>
  );
}
