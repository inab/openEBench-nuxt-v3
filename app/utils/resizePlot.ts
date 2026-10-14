export function getPlotElement(target: string | HTMLElement | null | undefined) {
  if (typeof document === 'undefined') {
    return null;
  }

  const element = typeof target === 'string' ? document.getElementById(target) : target;

  return element?.isConnected ? element : null;
}

export async function resizePlot(
  target: string | HTMLElement | null | undefined,
  plotly: {
    relayout: (element: HTMLElement, update: { autosize: boolean }) => Promise<unknown>;
  }
) {
  const element = getPlotElement(target);

  if (!element || !element.classList.contains('js-plotly-plot')) {
    return;
  }

  await plotly.relayout(element, { autosize: true });
}
