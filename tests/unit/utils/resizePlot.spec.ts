// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { resizePlot } from '~/utils/resizePlot';

describe('resizePlot', () => {
  const relayout = vi.fn().mockResolvedValue(undefined);
  const plotly = { relayout };

  beforeEach(() => {
    relayout.mockClear();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  test('skips missing and uninitialized plot elements', async () => {
    const element = document.createElement('div');
    element.id = 'plot';
    document.body.append(element);

    await resizePlot('missing', plotly);
    await resizePlot('plot', plotly);

    expect(relayout).not.toHaveBeenCalled();
  });

  test('resizes only a connected Plotly element', async () => {
    const element = document.createElement('div');
    element.id = 'plot';
    element.classList.add('js-plotly-plot');
    document.body.append(element);

    await resizePlot('plot', plotly);
    expect(relayout).toHaveBeenCalledWith(element, { autosize: true });

    relayout.mockClear();
    element.remove();
    await resizePlot(element, plotly);
    expect(relayout).not.toHaveBeenCalled();
  });
});
