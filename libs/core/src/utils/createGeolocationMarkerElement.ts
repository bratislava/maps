export const createGeolocationMarkerElement = () => {
  const container = document.createElement('div');
  container.style.backgroundColor = 'var(--input-stroke-color)';
  container.style.width = '16px';
  container.style.height = '16px';
  container.style.borderRadius = '50%';
  container.style.padding = '4px';

  const innerElement = document.createElement('div');
  innerElement.style.backgroundColor = 'var(--primary-color)';
  innerElement.style.width = '100%';
  innerElement.style.height = '100%';
  innerElement.style.borderRadius = '50%';

  container.appendChild(innerElement);

  return container;
};
