import React from 'react';
 // Import your dashboard CSS file
import GrantAdminAccess from './GrantAdminAccess';
import RevokeAdminAccess from './RevokeAdminAccess';
import ReportViewer from './ReportViewer';
import ReportNotification from './ReportNotification';
/*
import SearchReport from './SearchReport';

import ReportDetails from './ReportDetails';
import RewardAnonymousReporter from './RewardAnonymousReporter';
import ReportChart from './ReportChart';*/

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <header className="header-desktop">
        {/* Header content */}
      </header>
      <aside className="menu-sidebar d-none d-lg-block">
        {/* Sidebar content */}
        <ul className="list-unstyled navbar__list">
          <li className="has-sub">
            <a className="js-arrow" href="#">
              <i className="fas fa-tachometer-alt"></i>Dashboard</a>
            <ul className="list-unstyled navbar__sub-list js-sub-list">
              <li><a href="#grant-access">Grant Admin Access</a></li>
              <li><a href="#revoke-access">Revoke Admin Access</a></li>
              <li><a href="#search-report">Search Report</a></li>
              <li><a href="#report-notification">Report Notification</a></li>
              <li><a href="#report-details">Report Details</a></li>
              <li><a href="#reward-reporter">Reward Anonymous Reporter</a></li>
              <li><a href="#report-chart">Report Chart</a></li>
            </ul>
          </li>
        </ul>
      </aside>
      <div className="main-content">
        <div className="section__content section__content--p30">
          <div className="container-fluid">
            {/* Main content */}
            <section id="grant-access">
              <GrantAdminAccess />
            </section>
            <section id="revoke-access">
              <RevokeAdminAccess />
            </section>
            <section id="report-viewer">
              <ReportViewer />
            </section>
           
            
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
