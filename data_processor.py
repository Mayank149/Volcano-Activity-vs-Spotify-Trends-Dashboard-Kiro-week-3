import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def clean_volcano_data():
    """Clean and prepare volcano eruption dataset"""
    print("Processing volcano eruption data...")
    
    # Read the volcano data
    df = pd.read_csv('eruptions.csv')
    
    # Remove rows with missing year data
    df = df.dropna(subset=['start_year'])
    
    # Filter to 2017-2021 data
    df = df[(df['start_year'] >= 2017) & (df['start_year'] <= 2021)]
    
    # Create date column, handling missing month/day values
    df['start_month'] = df['start_month'].fillna(1).astype(int)
    df['start_day'] = df['start_day'].fillna(1).astype(int)
    df['start_year'] = df['start_year'].astype(int)
    
    # Convert to datetime using string format
    df['date_string'] = df['start_year'].astype(str) + '-' + df['start_month'].astype(str).str.zfill(2) + '-' + df['start_day'].astype(str).str.zfill(2)
    df['eruption_date'] = pd.to_datetime(df['date_string'], errors='coerce')
    
    # Remove rows with invalid dates
    df = df.dropna(subset=['eruption_date'])
    
    # Handle VEI values (convert to numeric, fill NaN with 0)
    df['vei'] = pd.to_numeric(df['vei'], errors='coerce').fillna(0)
    
    # Create weekly periods
    df['week'] = df['eruption_date'].dt.to_period('W')
    
    # Aggregate by week
    weekly_volcano = df.groupby('week').agg({
        'eruption_number': 'count',  # eruption_count
        'vei': ['mean', 'max']       # average_vei, max_vei
    }).reset_index()
    
    # Flatten column names
    weekly_volcano.columns = ['period', 'eruption_count', 'avg_vei', 'max_vei']
    
    # Convert period to string for easier merging
    weekly_volcano['period'] = weekly_volcano['period'].astype(str)
    
    print(f"Processed {len(df)} volcano eruptions into {len(weekly_volcano)} weekly periods")
    
    # Save cleaned volcano data
    df.to_csv('cleaned_volcano_data.csv', index=False)
    
    return weekly_volcano

def clean_spotify_data():
    """Clean and prepare Spotify dataset"""
    print("Processing Spotify data...")
    
    # Read the Spotify data
    df = pd.read_csv('spotify-top-200-dataset.csv', delimiter=';')
    
    # Parse the week column to datetime
    df['week_date'] = pd.to_datetime(df['week'], format='%m/%d/%Y', errors='coerce')
    
    # Filter to 2017-2021 data
    df = df[(df['week_date'].dt.year >= 2017) & (df['week_date'].dt.year <= 2021)]
    
    # Create weekly periods to match volcano data
    df['week_period'] = df['week_date'].dt.to_period('W')
    
    # Clean genre data - extract primary genre
    df['primary_genre'] = df['artist_genres'].str.split(',').str[0].str.strip()
    df['primary_genre'] = df['primary_genre'].fillna('unknown')
    
    # Aggregate by week
    weekly_spotify = df.groupby('week_period').agg({
        'streams': 'sum',           # total_streams
        'track_id': 'nunique',      # unique track count
        'primary_genre': lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else 'unknown'  # most frequent genre
    }).reset_index()
    
    # Rename columns
    weekly_spotify.columns = ['period', 'total_streams', 'track_count', 'top_genre']
    
    # Convert period to string for easier merging
    weekly_spotify['period'] = weekly_spotify['period'].astype(str)
    
    print(f"Processed {len(df)} Spotify entries into {len(weekly_spotify)} weekly periods")
    
    # Save cleaned Spotify data
    df.to_csv('cleaned_spotify_data.csv', index=False)
    
    return weekly_spotify

def merge_datasets(volcano_df, spotify_df):
    """Merge volcano and Spotify datasets"""
    print("Merging datasets...")
    
    # Merge on period
    merged_df = pd.merge(volcano_df, spotify_df, on='period', how='outer')
    
    # Fill missing values
    merged_df['eruption_count'] = merged_df['eruption_count'].fillna(0)
    merged_df['avg_vei'] = merged_df['avg_vei'].fillna(0)
    merged_df['max_vei'] = merged_df['max_vei'].fillna(0)
    merged_df['total_streams'] = merged_df['total_streams'].fillna(0)
    merged_df['track_count'] = merged_df['track_count'].fillna(0)
    merged_df['top_genre'] = merged_df['top_genre'].fillna('unknown')
    
    # Sort by period
    merged_df = merged_df.sort_values('period')
    
    print(f"Merged dataset contains {len(merged_df)} weekly periods")
    
    # Save merged dataset
    merged_df.to_csv('merged_dataset.csv', index=False)
    
    return merged_df

def main():
    """Main processing function"""
    print("Starting data processing pipeline...")
    
    # Process datasets
    volcano_weekly = clean_volcano_data()
    spotify_weekly = clean_spotify_data()
    
    # Merge datasets
    merged_data = merge_datasets(volcano_weekly, spotify_weekly)
    
    print("\nData processing complete!")
    print(f"Final dataset shape: {merged_data.shape}")
    print("\nSample of merged data:")
    print(merged_data.head())
    
    # Generate summary statistics
    print("\n=== SUMMARY STATISTICS ===")
    print(f"Total weeks analyzed: {len(merged_data)}")
    print(f"Weeks with volcano activity: {(merged_data['eruption_count'] > 0).sum()}")
    print(f"Total eruptions: {merged_data['eruption_count'].sum()}")
    print(f"Average VEI: {merged_data['avg_vei'].mean():.2f}")
    print(f"Max VEI recorded: {merged_data['max_vei'].max()}")
    print(f"Total streams: {merged_data['total_streams'].sum():,.0f}")
    print(f"Average weekly streams: {merged_data['total_streams'].mean():,.0f}")
    print(f"Most common genre: {merged_data['top_genre'].mode().iloc[0] if len(merged_data['top_genre'].mode()) > 0 else 'N/A'}")

if __name__ == "__main__":
    main()
    main()