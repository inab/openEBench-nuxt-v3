import type { ChartDefault } from "../types/visualizations";

export class ChartBar implements ChartDefault {
  id: string = "bar";
  name: string = "Bar Plot";
  internal_id: string = "";
  image: string =
    "https://inab.github.io/oeb-widgets-graphs/assets/videos/bar-plot.gif";
  description: string =
    "A bar plot is a graphical representation used to compare different categories or groups. It displays data using rectangular bars, where the length or height of each bar is proportional to the value it represents. Bar plots can be vertical or horizontal and are useful for visualizing categorical data or trends over time.";
}

export class ChartBox implements ChartDefault {
  id: string = "box";
  name: string = "Box Plot";
  internal_id: string = "";
  image: string =
    "https://inab.github.io/oeb-widgets-graphs/assets/videos/box-plot.gif";
  description: string =
    "A box plot, also known as a whisker plot, is a graphical representation used to summarize the distribution of a dataset. It displays key statistics, including the median, quartiles, and potential outliers. The box represents the interquartile range (IQR), which contains the middle 50% of the data, while the line inside the box indicates the median. Whiskers extend from the box to show the range of the data, excluding outliers, which are plotted as individual points. Box plots are useful for comparing distributions and identifying variability or skewness in the data.";
}

export class ChartRadar implements ChartDefault {
  id: string = "radar";
  name: string = "Radar Plot";
  internal_id: string = "";
  image: string =
    "https://inab.github.io/oeb-widgets-graphs/assets/videos/radar-plot.gif";
  description: string =
    "A radar plot, also known as a spider or web chart, is a graphical method used to display multivariate data. It consists of a circular grid with axes radiating out from the center, each representing a variable. Data points are plotted on these axes and connected to form a polygon. Radar plots are particularly useful for comparing multiple attributes or categories and visualizing data distributions across different dimensions.";
}

export class ChartScatter implements ChartDefault {
  id: string = "scatter";
  name: string = "Scatter Plot";
  internal_id: string = "";
  image: string =
    "https://inab.github.io/oeb-widgets-graphs/assets/videos/scatter-plot.gif";
  description: string =
    "A scatter plot is a graphical representation used to display the relationship between two numerical variables. It consists of points plotted on a Cartesian coordinate system, where each point represents an observation with its position determined by the values of the two variables. Scatter plots are ideal for identifying patterns, correlations, and trends, as well as detecting outliers in data.";
}
