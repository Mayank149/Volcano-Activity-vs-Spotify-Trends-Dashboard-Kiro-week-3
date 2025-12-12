# 🌋🎵 Volcano Activity vs Spotify Trends Dashboard

An interactive data visualization project that explores the relationship between global volcanic eruptions and music streaming patterns from 2017-2021. This unique data mashup demonstrates how seemingly unrelated global phenomena can be analyzed together to reveal interesting temporal patterns and insights.

## 🎯 Project Overview

This project combines two seemingly unrelated datasets:
- **Global Volcano Eruptions** (2017-2021): Historical volcanic activity data
- **Spotify Top 200 Dataset** (2017-2021): Global music streaming trends

The goal is to create an engaging dashboard that visualizes both datasets and explores any potential correlations between volcanic activity and music consumption patterns.

## ✨ Features

- 📊 **Interactive Time Series Analysis** - Dual-axis visualization of volcanic eruptions and streaming data
- 🌋 **Volcanic Explosivity Index (VEI) Tracking** - Annual distribution and intensity analysis
- 🎵 **Music Genre Trends** - Comprehensive genre analysis showing Dance Pop dominance (92.8%)
- 📈 **Correlation Analysis** - Statistical examination of relationships between datasets
- 📱 **Responsive Design** - Modern glassmorphism UI that works on all devices
- ⚡ **Real-time Processing** - Dynamic data loading and interactive visualizations
- 🔧 **Extensible Architecture** - Easy to modify and add new datasets

## 📁 Project Structure

```
├── index.html                    # Main dashboard interface
├── styles.css                    # Modern responsive styling
├── dashboard.js                  # Interactive Chart.js visualizations
├── merged_dataset.csv            # Processed weekly time-series data
├── data_processor.py             # Data cleaning and processing pipeline
├── serve_dashboard.py            # Local development server
├── README.md                     # Project documentation
├── data_explanation.md           # Technical data processing details
├── eruptions.csv                 # Raw volcano eruption dataset (2017-2021)
├── spotify-top-200-dataset.csv   # Raw Spotify Top 200 dataset (2017-2021)
├── cleaned_volcano_data.csv      # Processed volcano data
└── cleaned_spotify_data.csv      # Processed Spotify data
```

## 🚀 Quick Start

### 1. Process the Data
```bash
python data_processor.py
```

This will:
- Clean and filter both datasets to 2017-2021
- Aggregate data into weekly periods
- Generate cleaned CSV files
- Create the merged dataset
- Display summary statistics

### 2. Launch the Dashboard
```bash
python serve_dashboard.py
```

This will:
- Start a local web server on port 8002
- Automatically open the dashboard in your browser
- Serve the interactive visualization at `http://localhost:8002`

## 📊 Dashboard Features

### Interactive Visualizations
1. **Time Series Comparison**: Dual-axis chart showing volcanic eruptions and Spotify streams over time
2. **VEI Distribution**: Bar chart displaying Volcanic Explosivity Index trends by year
3. **Genre Analysis**: Pie chart of most popular music genres during the period
4. **Correlation Analysis**: Scatter plot examining relationships between volcanic activity and streaming

### Key Statistics
- Total eruptions and streams
- Active weeks with volcanic activity
- Maximum VEI recorded
- Real-time data insights

### Responsive Design
- Mobile-friendly interface
- Interactive hover effects
- Smooth animations and transitions
- Modern glassmorphism design

## 📈 Key Findings

### Volcanic Activity (2017-2021)
- **110 total eruptions** across 84 active weeks
- **Average VEI of 0.37** (mostly small to moderate eruptions)
- **Maximum VEI of 3** (moderate explosive eruption)
- Most activity concentrated in specific volcanic regions

### Music Trends (2017-2021)
- **622+ billion total streams** analyzed
- **Dance Pop** dominated the charts
- **Consistent streaming patterns** with seasonal variations
- **200 tracks per week** average in Top 200

### Correlation Analysis
- **Minimal correlation** between volcanic activity and streaming patterns
- **Independent trends** suggest no significant relationship
- **Interesting temporal patterns** in both datasets worth exploring

## 🛠 Technical Implementation

### Data Processing
- **Python & Pandas**: Data cleaning and aggregation
- **Weekly time periods**: Consistent temporal alignment
- **Robust error handling**: Missing value management
- **Statistical analysis**: Correlation calculations

### Visualization
- **Chart.js**: Interactive web-based charts
- **Responsive design**: Mobile and desktop compatibility
- **Real-time updates**: Dynamic data loading
- **Custom styling**: Modern UI/UX design

### Web Interface
- **Pure HTML/CSS/JS**: No framework dependencies
- **Local server**: Simple Python HTTP server
- **Cross-platform**: Works on Windows, Mac, Linux
- **Browser compatibility**: Modern web standards

## 📋 Requirements

### Python Dependencies
```bash
pip install pandas numpy
```

### Browser Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local file access permissions

## 🔧 Customization

### Modify Data Processing
Edit `data_processor.py` to:
- Change time period filters
- Adjust aggregation methods
- Add new calculated metrics
- Modify data cleaning rules

### Customize Dashboard
Edit dashboard files to:
- `styles.css`: Change colors, layout, animations
- `dashboard.js`: Add new chart types, modify interactions
- `index.html`: Update content, add new sections

### Server Configuration
Edit `serve_dashboard.py` to:
- Change port number
- Add CORS headers
- Enable HTTPS
- Add authentication

## 🎨 Design Philosophy

This project demonstrates:
- **Creative data mashup**: Combining unrelated datasets for novel insights
- **Interactive storytelling**: Engaging visualizations that reveal patterns
- **Technical excellence**: Clean code, robust processing, modern web design
- **Educational value**: Learning through exploration and discovery

## 📝 Data Sources

- **Volcano Data**: Global Volcanism Program, Smithsonian Institution
- **Spotify Data**: Spotify Charts API aggregated dataset
- **Time Period**: January 2017 - December 2021
- **Geographic Scope**: Global coverage

## 🤝 Contributing

Feel free to:
- Add new visualization types
- Improve data processing algorithms
- Enhance the dashboard design
- Suggest additional datasets to incorporate

## 📄 License

This project is for educational and research purposes. Please respect the original data sources' terms of use.

## 👨‍💻 Author

**Mayank Bansal** - Built with [Kiro IDE](https://kiro.ai)

---

**Enjoy exploring the fascinating intersection of geological activity and global music trends!** 🌋🎵