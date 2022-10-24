import { FC } from 'react';

export interface IExampleDisplayer {
  component: FC<{}>;
  title: string;
  contentId: string;
}

export const ExampleDisplayer = ({
  component: Component,
  title,
  contentId,
}: IExampleDisplayer) => {
  const code = examples[contentId];

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="font-bold text-2xl">{title}</h1>
      <div className="border rounded-xl overflow-hidden">
        <Component />
      </div>

      <div className="overflow-auto p-8 bg-[#0d1117] rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    </div>
  );
};
