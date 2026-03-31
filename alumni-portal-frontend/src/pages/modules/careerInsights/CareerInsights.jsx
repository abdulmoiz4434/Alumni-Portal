import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Loader } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import API from '../../../api/axios';
import './CareerInsights.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const GOLD_SHADES = [
  'rgba(230, 187, 47, 0.9)',
  'rgba(212, 170, 40, 0.9)',
  'rgba(194, 153, 33, 0.9)',
  'rgba(176, 136, 26, 0.9)',
  'rgba(158, 119, 19, 0.9)',
  'rgba(140, 102, 12, 0.9)',
  'rgba(122, 85, 5, 0.9)',
  'rgba(104, 68, 0, 0.9)',
  'rgba(86, 51, 0, 0.9)',
  'rgba(68, 34, 0, 0.9)',
];

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" />
    <path d="M12 14h.01" /><path d="M16 10h.01" />
    <path d="M16 14h.01" /><path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// Static — defined outside component to avoid recreation on every render
const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#1a1a2e',
      bodyColor: '#6b7280',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => `Count: ${context.parsed.x}`,
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#6b7280',
        font: { size: 12 }
      },
      grid: {
        color: '#e0e0e0',
        drawBorder: false,
      }
    },
    y: {
      ticks: {
        color: '#6b7280',
        font: { size: 12 }
      },
      grid: {
        display: false,
      }
    }
  }
};

const CareerInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get('/careerInsights/career-data');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Error loading career insights:", err);
        setError(err.response?.data?.message || "Failed to load career data");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="career-insights">
        <div className="career-insight-loading">
          <Loader className="loading-spinner" />
          <p>Loading career data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="career-insights">
        <div className="career-insights-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const jobTitleData = {
    labels: data?.jobTitles?.map(item => item._id) || [],
    datasets: [{
      label: 'Number of Alumni',
      data: data?.jobTitles?.map(item => item.count) || [],
      backgroundColor: GOLD_SHADES,
      borderColor: GOLD_SHADES.map(color => color.replace('0.9', '1')),
      borderWidth: 1,
      borderRadius: 6,
    }]
  };

  const companyData = {
    labels: data?.companies?.map(item => item._id) || [],
    datasets: [{
      label: 'Alumni Employed',
      data: data?.companies?.map(item => item.count) || [],
      backgroundColor: GOLD_SHADES,
      borderColor: GOLD_SHADES.map(color => color.replace('0.9', '1')),
      borderWidth: 1,
      borderRadius: 6,
    }]
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

      <div className="career-insights-stats-grid">
        <div className="career-insights-stat-card">
          <div className="stat-icon"><UsersIcon /></div>
          <p className="stat-label">Total Alumni</p>
          <p className="stat-value">{data?.totalContributors?.toLocaleString()}</p>
        </div>
        <div className="career-insights-stat-card">
          <div className="stat-icon"><BriefcaseIcon /></div>
          <p className="stat-label">Unique Roles</p>
          <p className="stat-value">{data?.jobTitles?.length}</p>
        </div>
        <div className="career-insights-stat-card">
          <div className="stat-icon"><BuildingIcon /></div>
          <p className="stat-label">Companies</p>
          <p className="stat-value">{data?.companies?.length}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <TrendingUpIcon />
            <h3>Common Job Titles</h3>
          </div>
          <div className="chart-box">
            <Bar data={jobTitleData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <BuildingIcon />
            <h3>Top 10 Employers</h3>
          </div>
          <div className="chart-box">
            <Bar data={companyData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerInsights;