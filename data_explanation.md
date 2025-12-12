# Data Processing and Merging Explanation

## Overview
This project combines two seemingly unrelated datasets to explore potential patterns between global volcanic activity and music streaming trends from 2017-2021.

## Datasets Used

### 1. Volcano Eruptions Dataset
- **Source**: Global Volcanism Program
- **Original columns**: volcano_number, volcano_name, eruption_number, eruption_category, area_of_activity, vei, start_year, start_month, start_day, evidence_method_dating, end_year, end_month, end_day, latitude, longitude
- **Time period**: Filtered to 2017-2021
- **Records processed**: 110 eruptions

### 2. Spotify Top 200 Dataset
- **Source**: Spotify Charts API data
- **Original columns**: track_id, track_name, artist_names, rank, week, streams, artist_genres, and many audio features
- **Time period**: 2017-2021
- **Records processed**: 74,660 chart entries

## Data Cleaning Process

### Volcano Data Cleaning
1. **Date Processing**: Combined start_year, start_month, start_day into a single eruption_date
2. **Missing Value Handling**: Filled missing months/days with 1 (January 1st)
3. **VEI Processing**: Converted Volcanic Explosivity Index to numeric, filled NaN with 0
4. **Time Filtering**: Kept only eruptions from 2017-2021
5. **Weekly Aggregation**: Grouped eruptions by week periods

### Spotify Data Cleaning
1. **Date Parsing**: Converted week strings to datetime objects
2. **Genre Processing**: Extracted primary genre from comma-separated artist_genres
3. **Time Filtering**: Kept only data from 2017-2021
4. **Weekly Aggregation**: Grouped by week periods to match volcano data

## Aggregation Strategy

Both datasets were aggregated to **weekly periods** to enable meaningful comparison:

### Volcano Weekly Metrics
- `eruption_count`: Number of eruptions that started in each week
- `avg_vei`: Average Volcanic Explosivity Index for the week
- `max_vei`: Maximum VEI recorded in the week

### Spotify Weekly Metrics
- `total_streams`: Sum of all streams for tracks in the Top 200 that week
- `track_count`: Number of unique tracks in the charts that week
- `top_genre`: Most frequently appearing genre in the Top 200 that week

## Merging Process

1. **Join Strategy**: Outer join on weekly periods to preserve all time periods
2. **Missing Value Handling**: Filled missing values with 0 for numeric columns, 'unknown' for genres
3. **Final Dataset**: 223 weekly periods from 2017-2021

## Key Statistics

- **Total Weeks Analyzed**: 223
- **Weeks with Volcanic Activity**: 84 (37.7%)
- **Total Eruptions**: 110
- **Average VEI**: 0.37 (mostly small to moderate eruptions)
- **Maximum VEI**: 3 (moderate explosive eruption)
- **Total Streams**: 622+ billion
- **Most Common Genre**: Dance Pop

## Analytical Approach

The dashboard provides several analytical views:

1. **Time Series Analysis**: Overlays volcanic activity and streaming patterns over time
2. **VEI Distribution**: Shows volcanic intensity patterns by year
3. **Genre Analysis**: Reveals music preference trends
4. **Correlation Analysis**: Examines potential relationships between volcanic activity and streaming

## Limitations and Considerations

1. **Causation vs Correlation**: Any observed patterns do not imply causation
2. **Data Completeness**: Volcano data may have reporting biases toward certain regions
3. **Spotify Coverage**: Represents only Spotify users, not global music consumption
4. **Time Granularity**: Weekly aggregation may mask shorter-term patterns
5. **Geographic Scope**: Volcano data is global while Spotify data may have regional biases

## Files Generated

1. `cleaned_volcano_data.csv`: Processed volcano eruption data
2. `cleaned_spotify_data.csv`: Processed Spotify streaming data  
3. `merged_dataset.csv`: Combined weekly dataset for analysis
4. `dashboard/`: Interactive HTML dashboard with visualizations

## Technical Implementation

- **Data Processing**: Python with pandas for data manipulation
- **Visualization**: Chart.js for interactive web-based charts
- **Dashboard**: HTML/CSS/JavaScript for responsive web interface
- **Time Handling**: Pandas Period objects for consistent weekly grouping