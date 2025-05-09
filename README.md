# TFTF Edge Visualizer

A Next.js web app for visualizing the TFTF (Temporal Flexible Transfer and Fare) Edge data structure and its routing algorithm, developed to support urban transit modeling and research.

## 🚀 Overview

**TFTF Edge Visualizer** provides an interactive interface to visualize and understand how the TFTF Edge algorithm models jeepney routes, transfers, and fare systems. This tool aids in debugging, demonstration, and research related to flexible route systems, especially in urban public transportation networks.

## 📦 Features

- ✅ Visual representation of TFTF edges and node connections  
- ✅ Simulation of dynamic routing and transfers  
- ✅ Step-by-step route finding and fare computation visualization  
- ✅ Interactive map/grid (optional) for city-specific transit layouts  
- ✅ Supports real-time or mock data from the TFTF API

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/)
- **Styling**: Tailwind CSS, ShadCN UI  
- **Visualization**: (Optional) D3.js / Leaflet.js / Visx (based on your use)  
- **API Integration**: REST API or WebSocket support with backend (FastAPI / Flask)

## 🧠 Background

TFTF Edge is a custom data structure and algorithm developed for modeling **flexible jeepney routes** in cities like **Cagayan de Oro**, Philippines. It handles:

- Temporal factors (schedules, wait times)
- Transfer paths between multiple routes
- Fare computation based on distance and route types

This visualizer helps researchers, students, and developers understand and test the algorithm behavior with visual feedback.

## 📸 Screenshots

> *(Insert screenshots or gifs of the visualizer here)*

## 📂 Project Structure

```bash
/
├── components/          # Reusable UI components
├── pages/               # Next.js pages
├── lib/                 # Utility functions and API logic
├── styles/              # Tailwind or global styles
├── public/              # Static assets
└── README.md
