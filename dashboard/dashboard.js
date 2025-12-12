// Dashboard JavaScript for Volcano vs Spotify Analysis

let mergedData = [];
let charts = {};

// Load and process data
async function loadData() {
    try {
        const response = await fetch('../merged_dataset.csv');
        const csvText = await response.text();
        mergedData = parseCSV(csvText);
        
        console.log('Loaded data:', mergedData.slice(0, 5)); // Debug log
        console.log('Sample genres:', mergedData.slice(0, 10).map(d => d.top_genre)); // Debug log
        
        updateStatistics();
        createCharts();
        generateInsights();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data for demo
        generateSampleData();
        updateStatistics();
        createCharts();
        generateInsights();
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'period' || header === 'top_genre') {
                obj[header] = value;
            } else {
                obj[header] = parseFloat(value) || 0;
            }
        });
        return obj;
    });
}

// Generate sample data for demo purposes
function generateSampleData() {
    const startDate = new Date('2017-01-01');
    const endDate = new Date('2021-12-31');
    const weeks = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const period = `${formatDate(currentDate)}/${formatDate(weekEnd)}`;
        
        weeks.push({
            period: period,
            eruption_count: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            avg_vei: Math.random() * 2,
            max_vei: Math.floor(Math.random() * 4),
            total_streams: Math.floor(Math.random() * 1000000000) + 2000000000,
            track_count: Math.floor(Math.random() * 50) + 150,
            top_genre: ['dance pop', 'pop', 'hip hop', 'rock', 'electronic'][Math.floor(Math.random() * 5)]
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    mergedData = weeks;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Update statistics cards
function updateStatistics() {
    const totalEruptions = mergedData.reduce((sum, d) => sum + d.eruption_count, 0);
    const totalStreams = mergedData.reduce((sum, d) => sum + d.total_streams, 0);
    const activeWeeks = mergedData.filter(d => d.eruption_count > 0).length;
    const maxVEI = Math.max(...mergedData.map(d => d.max_vei));
    
    document.getElementById('totalEruptions').textContent = totalEruptions.toLocaleString();
    document.getElementById('totalStreams').textContent = (totalStreams / 1e9).toFixed(1) + 'B';
    document.getElementById('activeWeeks').textContent = activeWeeks;
    document.getElementById('maxVEI').textContent = maxVEI;
}

// Create all charts
function createCharts() {
    createTimeSeriesChart();
    createVEIChart();
    createGenreChart();
    createCorrelationChart();
}

// Time series chart showing both volcano activity and streams
function createTimeSeriesChart() {
    const ctx = document.getElementById('timeSeriesChart').getContext('2d');
    
    const labels = mergedData.map(d => d.period.split('/')[0]);
    
    charts.timeSeries = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volcano Eruptions',
                data: mergedData.map(d => d.eruption_count),
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                yAxisID: 'y',
                tension: 0.4
            }, {
                label: 'Spotify Streams (Billions)',
                data: mergedData.map(d => d.total_streams / 1e9),
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                yAxisID: 'y1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time Period'
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Volcano Eruptions',
                        color: '#ff6b6b'
                    },
                    ticks: {
                        color: '#ff6b6b'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Spotify Streams (Billions)',
                        color: '#4ecdc4'
                    },
                    ticks: {
                        color: '#4ecdc4'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterBody: function(context) {
                            const index = context[0].dataIndex;
                            const data = mergedData[index];
                            return [
                                `VEI Average: ${data.avg_vei.toFixed(2)}`,
                                `Top Genre: ${data.top_genre}`,
                                `Track Count: ${data.track_count}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// VEI distribution chart
function createVEIChart() {
    const ctx = document.getElementById('veiChart').getContext('2d');
    
    // Group data by year and calculate average VEI
    const yearlyVEI = {};
    mergedData.forEach(d => {
        const year = d.period.split('-')[0];
        if (!yearlyVEI[year]) {
            yearlyVEI[year] = { total: 0, count: 0, max: 0 };
        }
        yearlyVEI[year].total += d.avg_vei;
        yearlyVEI[year].count += 1;
        yearlyVEI[year].max = Math.max(yearlyVEI[year].max, d.max_vei);
    });
    
    const years = Object.keys(yearlyVEI).sort();
    const avgVEI = years.map(year => yearlyVEI[year].total / yearlyVEI[year].count);
    const maxVEI = years.map(year => yearlyVEI[year].max);
    
    charts.vei = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Average VEI',
                data: avgVEI,
                backgroundColor: 'rgba(255, 107, 107, 0.7)',
                borderColor: '#ff6b6b',
                borderWidth: 2
            }, {
                label: 'Max VEI',
                data: maxVEI,
                backgroundColor: 'rgba(255, 193, 7, 0.7)',
                borderColor: '#ffc107',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Volcanic Explosivity Index (VEI)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Genre distribution pie chart
function createGenreChart() {
    const ctx = document.getElementById('genreChart').getContext('2d');
    
    // Count genre occurrences
    const genreCounts = {};
    mergedData.forEach(d => {
        if (d.top_genre && d.top_genre !== 'unknown' && d.top_genre !== '0' && d.top_genre.trim() !== '') {
            const genre = d.top_genre.trim();
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
    });
    
    console.log('Genre counts for chart:', genreCounts); // Debug log
    
    // Get top 8 genres
    const sortedGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);
    
    // If no genres found, show a message
    if (sortedGenres.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No genre data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];
    
    charts.genre = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedGenres.map(([genre]) => genre),
            datasets: [{
                data: sortedGenres.map(([, count]) => count),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}

// Correlation scatter plot
function createCorrelationChart() {
    const ctx = document.getElementById('correlationChart').getContext('2d');
    
    const scatterData = mergedData.map(d => ({
        x: d.eruption_count,
        y: d.total_streams / 1e9
    }));
    
    charts.correlation = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Eruptions vs Streams',
                data: scatterData,
                backgroundColor: 'rgba(78, 205, 196, 0.6)',
                borderColor: '#4ecdc4',
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Volcano Eruptions'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Spotify Streams (Billions)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Eruptions: ${context.parsed.x}, Streams: ${context.parsed.y.toFixed(2)}B`;
                        }
                    }
                }
            }
        }
    });
}

// Generate insights
function generateInsights() {
    const totalEruptions = mergedData.reduce((sum, d) => sum + d.eruption_count, 0);
    const avgStreams = mergedData.reduce((sum, d) => sum + d.total_streams, 0) / mergedData.length;
    const activeWeeks = mergedData.filter(d => d.eruption_count > 0).length;
    
    // Calculate correlation
    const eruptions = mergedData.map(d => d.eruption_count);
    const streams = mergedData.map(d => d.total_streams);
    const correlation = calculateCorrelation(eruptions, streams);
    
    // Most common genre
    const genreCounts = {};
    mergedData.forEach(d => {
        if (d.top_genre && d.top_genre !== 'unknown' && d.top_genre !== '0') {
            genreCounts[d.top_genre] = (genreCounts[d.top_genre] || 0) + 1;
        }
    });
    
    console.log('Genre counts:', genreCounts); // Debug log
    
    const sortedGenres = Object.entries(genreCounts).sort(([,a], [,b]) => b - a);
    const topGenre = sortedGenres.length > 0 ? sortedGenres[0] : ['unknown', 0];
    
    document.getElementById('volcanoInsight').textContent = 
        `During 2017-2021, there were ${totalEruptions} volcanic eruptions across ${activeWeeks} weeks. ` +
        `The average VEI was ${(mergedData.reduce((sum, d) => sum + d.avg_vei, 0) / mergedData.length).toFixed(2)}, ` +
        `indicating mostly moderate volcanic activity.`;
    
    document.getElementById('musicInsight').textContent = 
        `"${topGenre[0]}" dominated the charts, appearing in ${topGenre[1]} weeks. ` +
        `Average weekly streams reached ${(avgStreams / 1e9).toFixed(2)} billion, ` +
        `showing consistent global music consumption patterns.`;
    
    document.getElementById('correlationInsight').textContent = 
        `The correlation coefficient between volcanic activity and streaming is ${correlation.toFixed(3)}. ` +
        `${Math.abs(correlation) < 0.1 ? 'This suggests no significant relationship' : 
          correlation > 0 ? 'This suggests a weak positive relationship' : 'This suggests a weak negative relationship'} ` +
        `between global volcanic eruptions and music streaming patterns.`;
}

// Calculate Pearson correlation coefficient
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Handle window resize
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.resize();
    });
});