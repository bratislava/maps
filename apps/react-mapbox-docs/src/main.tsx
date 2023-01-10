import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import cx from 'classnames';

import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  Outlet,
} from 'react-router-dom';
import { ExampleDisplayer } from './components/ExampleDisplayer';

import { DisplayMap } from './examples/DisplayMap';
import { CustomTheme } from './examples/CustomTheme';
import { DisplayMarker } from './examples/DisplayMarker';

const examples = [
  {
    component: DisplayMap,
    title: 'Display map',
    contentId: 'DisplayMap',
  },
  {
    component: CustomTheme,
    title: 'Custom theme',
    contentId: 'CustomTheme',
  },
  {
    component: DisplayMarker,
    title: 'Display marker',
    contentId: 'DisplayMarker',
  },
];

const examplesWithSlugs = examples.map((example) => ({
  ...example,
  path: `${(example.title).toLowerCase()}`,
}));

const Router = () => {
  return (
    <div className="container flex">
      <div className="w-48 shrink-0 flex flex-col gap-4 h-fit py-8 pr-8 border-r">
        <div className="font-bold">Examples</div>
        <div className="flex flex-col">
          {examplesWithSlugs.map((example) => (
            <NavLink
              className={({ isActive }: any) =>
                cx('px-4 py-2 rounded-lg hover: text-blue-500', {
                  ' bg-blue-500/20 font-semibold': isActive,
                })
              }
              key={example.path}
              to={example.path}
            >
              {example.title}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex-1 w-full pl-8">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: 'examples',
    element: <Router />,
    children: examplesWithSlugs.map((example) => ({
      path: example.path,
      element: <ExampleDisplayer {...example} />,
    })),
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('No #root element...');
} else {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
