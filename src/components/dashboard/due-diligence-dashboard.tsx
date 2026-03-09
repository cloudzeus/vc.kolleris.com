"use client"

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Download,
    ExternalLink
} from 'lucide-react';

interface DueDiligenceDashboardProps {
    user: any;
}

export function DueDiligenceDashboard({ user }: DueDiligenceDashboardProps) {
    return (
        <div className="min-h-screen bg-black">
            {/* Gradient Header */}
            <div className="w-full h-20 bg-gradient-to-r from-purple-600 via-pink-500 via-orange-400 via-yellow-400 to-green-400 flex items-center px-8">
                <h1 className="text-2xl font-bold text-white">Due Diligence Dashboard</h1>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Top Row - 3 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transaction Overview */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold">Transaction Overview</h2>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Donut Chart */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#1e293b"
                                        strokeWidth="12"
                                    />
                                    {/* Green segment (50%) */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="12"
                                        strokeDasharray="125.6 251.2"
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                    />
                                    {/* Orange segment (30%) */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="12"
                                        strokeDasharray="75.36 251.2"
                                        strokeDashoffset="-125.6"
                                        strokeLinecap="round"
                                    />
                                    {/* Red segment (20%) */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="12"
                                        strokeDasharray="50.24 251.2"
                                        strokeDashoffset="-200.96"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-bold text-white">190</div>
                                    <div className="text-sm text-slate-400">Total</div>
                                </div>
                            </div>
                        </div>

                        {/* Alert Levels */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-slate-300">Low Level Alerts</span>
                                </div>
                                <span className="text-white font-semibold">80</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    <span className="text-sm text-slate-300">Medium Level Alerts</span>
                                </div>
                                <span className="text-white font-semibold">65</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-slate-300">High Level Alerts</span>
                                </div>
                                <span className="text-white font-semibold">45</span>
                            </div>
                        </div>
                    </Card>

                    {/* Related Parties */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold">Related Parties</h2>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                                Beneficial Owners
                            </Badge>
                            <Badge variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                Directors
                            </Badge>
                            <Badge variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                Key Controllers
                            </Badge>
                        </div>

                        {/* Person Card */}
                        <div className="bg-slate-900 rounded-lg p-4 mb-4">
                            <h3 className="text-xl font-bold text-white mb-4">Stephanie Georg</h3>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-800 rounded px-3 py-2">
                                    <div className="text-xs text-slate-400 mb-1">Primary Owner</div>
                                    <div className="text-sm text-white font-medium">80% Ownership</div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-slate-500">📞</span>
                                    <span>(+44) 1122334455</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-slate-500">✉️</span>
                                    <span>sgeorg@bclf.com</span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Name</span>
                                    <span className="text-white">Defi LTD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Country of Incorporation</span>
                                    <span className="text-white">UK</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Entity Type</span>
                                    <span className="text-white">Corporation</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Account Opening Date</span>
                                    <span className="text-white">01-Jan-2020</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Transaction Monitoring */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold">Transaction Monitoring</h2>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Table */}
                        <div className="space-y-3 mb-6">
                            <div className="grid grid-cols-6 gap-2 text-xs text-slate-400 pb-2 border-b border-slate-700">
                                <span>Date</span>
                                <span>Type</span>
                                <span>Amount</span>
                                <span>Alerts</span>
                                <span className="col-span-2">Payment Reference</span>
                            </div>

                            {[
                                { date: 'Jul 9, 2024', type: 'Credit', amount: '$10,000', alert: 'green', ref: 'TRX123456789' },
                                { date: 'Jul 31, 2024', type: 'Debit', amount: '$8,000', alert: 'green', ref: 'PAY987654321' },
                                { date: 'Aug 01, 2024', type: 'Credit', amount: '$24,000', alert: 'red', ref: 'DEP1122334455' },
                            ].map((tx, i) => (
                                <div key={i} className="grid grid-cols-6 gap-2 text-xs text-slate-300 py-2">
                                    <span>{tx.date}</span>
                                    <span>{tx.type}</span>
                                    <span className="font-semibold text-white">{tx.amount}</span>
                                    <span>
                                        <div className={`w-3 h-3 rounded-full ${tx.alert === 'green' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                    </span>
                                    <span className="col-span-2 text-slate-400">{tx.ref}</span>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 text-xs mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-slate-300">Credit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-slate-300">Debit</span>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="h-48 relative">
                            <svg className="w-full h-full" viewBox="0 0 400 150">
                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <line
                                        key={i}
                                        x1="0"
                                        y1={i * 37.5}
                                        x2="400"
                                        y2={i * 37.5}
                                        stroke="#334155"
                                        strokeWidth="0.5"
                                    />
                                ))}

                                {/* Credit line (green) */}
                                <polyline
                                    points="0,80 50,70 100,60 150,65 200,55 250,60 300,50 350,55 400,45"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                />

                                {/* Debit line (red) */}
                                <polyline
                                    points="0,100 50,95 100,90 150,95 200,85 250,90 300,80 350,85 400,75"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                />
                            </svg>

                            {/* X-axis labels */}
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bottom Row - 2 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ongoing Due Diligence */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold">Ongoing Due Diligence</h2>
                            <Button variant="link" className="text-blue-400 text-sm">View Details</Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">14</div>
                                <div className="text-xs text-slate-400">Screened</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">05</div>
                                <div className="text-xs text-slate-400">Alerts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">8s</div>
                                <div className="text-xs text-slate-400">ART</div>
                            </div>
                        </div>

                        <Badge className="bg-slate-900 text-white border-0 mb-4">Name Screening</Badge>

                        {/* World Map */}
                        <div className="bg-slate-900 rounded-lg p-6 h-64 relative overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 800 400">
                                {/* Simplified world map dots */}
                                {/* North America */}
                                <circle cx="150" cy="120" r="8" fill="#22c55e" className="animate-pulse" />
                                <circle cx="180" cy="140" r="6" fill="#22c55e" opacity="0.6" />

                                {/* Europe */}
                                <circle cx="400" cy="100" r="8" fill="#22c55e" className="animate-pulse" />
                                <circle cx="420" cy="110" r="6" fill="#22c55e" opacity="0.6" />

                                {/* Asia */}
                                <circle cx="600" cy="140" r="8" fill="#22c55e" className="animate-pulse" />
                                <circle cx="620" cy="160" r="6" fill="#22c55e" opacity="0.6" />

                                {/* Australia */}
                                <circle cx="680" cy="280" r="8" fill="#22c55e" className="animate-pulse" />

                                {/* Decorative grid */}
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <line
                                        key={`v-${i}`}
                                        x1={i * 40}
                                        y1="0"
                                        x2={i * 40}
                                        y2="400"
                                        stroke="#1e293b"
                                        strokeWidth="0.5"
                                    />
                                ))}
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <line
                                        key={`h-${i}`}
                                        x1="0"
                                        y1={i * 40}
                                        x2="800"
                                        y2={i * 40}
                                        stroke="#1e293b"
                                        strokeWidth="0.5"
                                    />
                                ))}
                            </svg>

                            {/* Countries Legend */}
                            <div className="absolute bottom-4 right-4 bg-slate-800 rounded-lg p-3 space-y-1">
                                <div className="text-xs text-slate-300">Top Countries</div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-slate-300">India</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-slate-300">UK</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-slate-300">United States</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-slate-300">Australia</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Transaction History */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-semibold">Transaction History</h2>
                            <Button variant="link" className="text-blue-400 text-sm">View Details</Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 mb-6">
                            <div>
                                <div className="text-5xl font-bold text-white mb-2">12</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-slate-300">Suspended</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-white mb-2">15</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-slate-300">Cleared</span>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="h-64 relative">
                            <svg className="w-full h-full" viewBox="0 0 400 200">
                                {/* Y-axis labels */}
                                <text x="5" y="10" className="text-xs fill-slate-400">100k</text>
                                <text x="5" y="60" className="text-xs fill-slate-400">80k</text>
                                <text x="5" y="110" className="text-xs fill-slate-400">60k</text>
                                <text x="5" y="160" className="text-xs fill-slate-400">40k</text>
                                <text x="5" y="195" className="text-xs fill-slate-400">20k</text>

                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <line
                                        key={i}
                                        x1="40"
                                        y1={i * 50}
                                        x2="400"
                                        y2={i * 50}
                                        stroke="#334155"
                                        strokeWidth="0.5"
                                    />
                                ))}

                                {/* Bars - Suspended (Red) and Cleared (Green) */}
                                {[
                                    { x: 60, suspended: 120, cleared: 100 },
                                    { x: 100, suspended: 90, cleared: 130 },
                                    { x: 140, suspended: 150, cleared: 140 },
                                    { x: 180, suspended: 110, cleared: 90 },
                                    { x: 220, suspended: 130, cleared: 120 },
                                    { x: 260, suspended: 100, cleared: 140 },
                                    { x: 300, suspended: 140, cleared: 110 },
                                    { x: 340, suspended: 120, cleared: 150 },
                                ].map((bar, i) => (
                                    <g key={i}>
                                        {/* Suspended bar (red) */}
                                        <rect
                                            x={bar.x}
                                            y={200 - bar.suspended}
                                            width="15"
                                            height={bar.suspended}
                                            fill="#ef4444"
                                            rx="2"
                                        />
                                        {/* Cleared bar (green) */}
                                        <rect
                                            x={bar.x + 18}
                                            y={200 - bar.cleared}
                                            width="15"
                                            height={bar.cleared}
                                            fill="#22c55e"
                                            rx="2"
                                        />
                                    </g>
                                ))}
                            </svg>

                            {/* X-axis labels */}
                            <div className="flex justify-between text-xs text-slate-400 mt-2 px-12">
                                <span>July 1</span>
                                <span>July 5</span>
                                <span>July 10</span>
                                <span>July 15</span>
                                <span>Aug 4</span>
                                <span>Aug 6</span>
                                <span>Aug 8</span>
                            </div>

                            {/* Value labels */}
                            <div className="absolute top-2 right-4 space-y-1">
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">$38,000</div>
                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded mt-20">$30,000</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
