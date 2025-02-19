import React from 'react';
import { Chart } from 'chart.js/auto';

const Analysis = () => {
  // Dummy data
  const trafficData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Traffic',
        data: [1000, 1500, 1200, 1800, 2000],
        borderColor: '#3b82f6',
        fill: false,
      },
    ],
  };

  const audienceData = {
    labels: ['18-24', '25-34', '35-44', '45+'],
    datasets: [
      {
        label: 'Age Group',
        data: [30, 40, 20, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      },
    ],
  };

  const trafficSources = [
    { name: 'Direct', percentage: 40, color: '#3b82f6' },
    { name: 'Search', percentage: 30, color: '#10b981' },
    { name: 'Social', percentage: 20, color: '#f59e0b' },
    { name: 'Referral', percentage: 10, color: '#8b5cf6' },
  ];

  // Initialize charts
  React.useEffect(() => {
    const trafficChart = new Chart(document.getElementById('trafficChart'), {
      type: 'line',
      data: trafficData,
    });

    const audienceChart = new Chart(document.getElementById('audienceChart'), {
      type: 'pie',
      data: audienceData,
    });

    return () => {
      trafficChart.destroy();
      audienceChart.destroy();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analysis</h1>

      {/* Traffic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Total Views</h3>
          <p className="text-3xl text-blue-600">10,000</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Unique Visitors</h3>
          <p className="text-3xl text-green-600">5,000</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Bounce Rate</h3>
          <p className="text-3xl text-yellow-600">30%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Avg. Time on Page</h3>
          <p className="text-3xl text-purple-600">2:30 mins</p>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Traffic Over Time</h3>
          <canvas id="trafficChart"></canvas>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Audience Demographics</h3>
          <canvas id="audienceChart"></canvas>
        </div>
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performing Blogs</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Blog Title</th>
              <th className="text-left">Views</th>
              <th className="text-left">Likes</th>
              <th className="text-left">Comments</th>
              <th className="text-left">Shares</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blog 1</td>
              <td>1000</td>
              <td>200</td>
              <td>50</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Blog 2</td>
              <td>800</td>
              <td>150</td>
              <td>30</td>
              <td>80</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Traffic Sources</h3>
        <div className="space-y-2">
          {trafficSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{source.name}</span>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Likes</h3>
          <p className="text-3xl text-blue-600">500</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Comments</h3>
          <p className="text-3xl text-green-600">100</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800">Shares</h3>
          <p className="text-3xl text-yellow-600">200</p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;