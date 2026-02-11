import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import API from '../../../api/axios';
import './CareerInsights.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CareerInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // INSIGHT-004: Automatically fetch/update insights on component load
    const fetchInsights = async () => {
      try {
        const res = await API.get('/careerInsights/career-data');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Error loading career insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <div className="insights-loader">Loading Career Data...</div>;

  // Formatting data for INSIGHT-001 (Job Titles)
  const jobTitleData = {
    labels: data?.jobTitles.map(item => item._id) || [],
    datasets: [{
      label: 'Number of Alumni',
      data: data?.jobTitles.map(item => item.count) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  const companyData = {
    labels: data?.companies.map(item => item._id) || [],
    datasets: [{
      label: 'Alumni Employed',
      data: data?.companies.map(item => item.count) || [],
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  return (
    <div className="career-insights">
      <div className="career-insights-hero">
        <div className="career-insights-hero-content">
          <h1 className="career-main-title">Career Insights</h1>
          <div className="career-subtitle">
            Data derived from <span>{data?.totalContributors || 0}</span> alumni profiles
          </div>
        </div>
      </div>

      <div className="insights-grid">
        {/* INSIGHT-001: Job Titles Chart */}
        <div className="chart-container">
          <h3>Common Job Titles</h3>
          <div className="chart-box">
            <Bar data={jobTitleData} options={options} />
          </div>
        </div>

        {/* INSIGHT-002: Top 10 Companies Chart */}
        <div className="chart-container">
          <h3>Top 10 Employers</h3>
          <div className="chart-box">
            <Bar data={companyData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerInsights;