import type { Feature } from '@/lib/content';

const columns = {
  one: 'gap-y-6',
  three: 'gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3',
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
    <ul className={`grid ${columns[layout]}`}>
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
          </h3>
          <p className="mt-1.5 body-text">{feature.text}</p>
        </li>
      ))}
    </ul>
  );
}
