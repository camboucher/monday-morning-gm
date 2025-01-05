// import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Flame, Award, TrendingDown, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TimelinePage = () => {
  const performanceData = [
    { week: 1, points: 125.6, projection: 110 },
    { week: 2, points: 142.3, projection: 115 },
    { week: 3, points: 98.4, projection: 112 },
    { week: 4, points: 156.7, projection: 118 },
    { week: 5, points: 132.1, projection: 120 },
    { week: 6, points: 145.8, projection: 122 },
    { week: 7, points: 115.9, projection: 118 },
    { week: 8, points: 128.4, projection: 115 },
    { week: 9, points: 138.2, projection: 120 },
    { week: 10, points: 144.5, projection: 125 },
    { week: 11, points: 133.7, projection: 122 },
    { week: 12, points: 149.2, projection: 128 },
    { week: 13, points: 159.8, projection: 130 },
    { week: 14, points: 142.3, projection: 125 }
  ];

  const keyMoments = [
    {
      week: 4,
      title: "Highest Score of the Season",
      description: "Put up 156.7 points against the league champion",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />
    },
    {
      week: 7,
      title: "Justin Jefferson to IR",
      description: "Lost your WR1 but managed to stay competitive",
      icon: <TrendingDown className="w-6 h-6 text-red-500" />
    },
    {
      week: 9,
      title: "Puka Nacua Breakout",
      description: "Your waiver pickup goes for 25+ points",
      icon: <Star className="w-6 h-6 text-purple-500" />
    },
    {
      week: 13,
      title: "Playoff Clinching Win",
      description: "Secured your playoff spot in style",
      icon: <Award className="w-6 h-6 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl font-bold mb-4">Your Season Timeline</h1>
          <p className="text-xl text-gray-400">A journey through your 2024 fantasy season</p>
        </motion.div>

        {/* Performance Graph */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Weekly Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis 
                  dataKey="week"
                  stroke="#fff"
                  tickFormatter={(week) => `Week ${week}`}
                />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey="points"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line 
                  type="monotone"
                  dataKey="projection"
                  stroke="#6b7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Key Moments */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Season Defining Moments</h2>
          <div className="space-y-6">
            {keyMoments.map((moment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="bg-gray-800 rounded-lg p-6 flex items-start space-x-4"
              >
                <div className="bg-gray-700 rounded-full p-3">
                  {moment.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Week {moment.week}</div>
                  <h3 className="text-xl font-semibold mb-2">{moment.title}</h3>
                  <p className="text-gray-300">{moment.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Season Summary Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Total Points", value: "1,912.9", icon: <Flame className="w-6 h-6 text-orange-500" /> },
            { label: "Weekly Average", value: "136.6", icon: <Trophy className="w-6 h-6 text-yellow-500" /> },
            { label: "Win Rate", value: "64%", icon: <Award className="w-6 h-6 text-green-500" /> }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="bg-gray-700 rounded-full p-3 w-fit mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TimelinePage;