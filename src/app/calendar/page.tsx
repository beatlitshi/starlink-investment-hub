'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Appointment {
  id: string;
  clientName: string;
  agentName: string;
  phoneNumber: string;
  appointmentType: string;
  duration: number; // in minutes
  location: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 22)); // January 22, 2026
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    agentName: '',
    phoneNumber: '',
    appointmentType: 'Consultation',
    duration: 30,
    location: '',
    time: '09:00',
    notes: '',
  });

  // Load appointments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('starlink-appointments');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading appointments:', err);
      }
    }
  }, []);

  // Save appointments to localStorage
  useEffect(() => {
    localStorage.setItem('starlink-appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Get today's date string
  const getTodayString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Get appointments for today
  const getTodayAppointments = () => {
    return appointments
      .filter(apt => apt.date === getTodayString() && apt.status === 'pending')
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Get calendar days
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        appointments: getAppointmentsForDate(date.toISOString().split('T')[0]),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        appointments: getAppointmentsForDate(date.toISOString().split('T')[0]),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        appointments: getAppointmentsForDate(date.toISOString().split('T')[0]),
      });
    }

    return days;
  };

  // Get appointments for specific date
  const getAppointmentsForDate = (dateString: string): Appointment[] => {
    return appointments.filter(apt => apt.date === dateString);
  };

  // Filter appointments by search
  const getFilteredAppointments = () => {
    return appointments.filter(apt => 
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phoneNumber.includes(searchQuery) ||
      apt.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Add or update appointment
  const handleSaveAppointment = () => {
    if (!selectedDate || !formData.clientName || !formData.agentName || !formData.phoneNumber) {
      alert('Please fill in all required fields (Name, Agent, Phone)');
      return;
    }

    const newAppointment: Appointment = {
      id: editingId || Date.now().toString(),
      ...formData,
      date: selectedDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      setAppointments(appointments.map(apt => apt.id === editingId ? newAppointment : apt));
      setEditingId(null);
    } else {
      setAppointments([...appointments, newAppointment]);
    }

    // Reset form
    setFormData({
      clientName: '',
      agentName: '',
      phoneNumber: '',
      appointmentType: 'Consultation',
      duration: 30,
      location: '',
      time: '09:00',
      notes: '',
    });
    setShowAddModal(false);
    setSelectedDate('');
  };

  // Delete appointment
  const handleDeleteAppointment = (id: string) => {
    if (confirm('Delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
    }
  };

  // Edit appointment
  const handleEditAppointment = (apt: Appointment) => {
    setFormData({
      clientName: apt.clientName,
      agentName: apt.agentName,
      phoneNumber: apt.phoneNumber,
      appointmentType: apt.appointmentType,
      duration: apt.duration,
      location: apt.location,
      time: apt.time,
      notes: apt.notes,
    });
    setSelectedDate(apt.date);
    setEditingId(apt.id);
    setShowAddModal(true);
  };

  // Complete appointment
  const handleCompleteAppointment = (id: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
  };

  const calendarDays = getCalendarDays();
  const todayAppointments = getTodayAppointments();
  const filteredAppointments = getFilteredAppointments();
  const todayString = getTodayString();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <span className="text-4xl">📅</span>
                Appointment Calendar
              </h1>
              <p className="text-muted-foreground mt-1">Manage your appointments and schedule</p>
            </div>
            <button
              onClick={() => {
                setShowAddModal(true);
                setSelectedDate(getTodayString());
                setEditingId(null);
                setFormData({
                  clientName: '',
                  agentName: '',
                  phoneNumber: '',
                  appointmentType: 'Consultation',
                  duration: 30,
                  location: '',
                  time: '09:00',
                  notes: '',
                });
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-accent transition-smooth"
            >
              + New Appointment
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Calendar */}
          <div className="flex-1">
            <div className="bg-card border border-border rounded-2xl shadow-depth p-6">
              {/* Calendar Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">{monthName}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-smooth"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-bold text-muted-foreground text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dateStr = day.date.toISOString().split('T')[0];
                  const isToday = dateStr === todayString;
                  const hasAppointments = day.appointments.length > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowAddModal(true);
                        setSelectedDate(dateStr);
                        setEditingId(null);
                        setFormData({
                          clientName: '',
                          agentName: '',
                          phoneNumber: '',
                          appointmentType: 'Consultation',
                          duration: 30,
                          location: '',
                          time: '09:00',
                          notes: '',
                        });
                      }}
                      className={`min-h-28 p-2 rounded-lg border-2 transition-smooth cursor-pointer ${
                        isToday
                          ? 'bg-primary/20 border-primary'
                          : day.isCurrentMonth
                          ? 'bg-card border-border hover:border-primary'
                          : 'bg-muted border-border opacity-50'
                      }`}
                    >
                      <div className={`text-sm font-bold mb-1 ${isToday ? 'text-primary' : day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {day.date.getDate()}
                      </div>
                      {hasAppointments && (
                        <div className="space-y-1">
                          {day.appointments.slice(0, 2).map((apt, i) => (
                            <div key={i} className="text-xs bg-accent/20 text-accent rounded px-1 py-0.5 truncate">
                              <div className="font-bold truncate">{apt.clientName}</div>
                              <div className="text-xs text-muted-foreground">{apt.agentName.split(' ')[0]} • {apt.time}</div>
                            </div>
                          ))}
                          {day.appointments.length > 2 && (
                            <div className="text-xs text-muted-foreground font-bold">+{day.appointments.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appointments List */}
            <div className="mt-6 bg-card border border-border rounded-2xl shadow-depth p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">All Appointments</h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, agent, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                  <Icon name="MagnifyingGlassIcon" className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Appointments Table */}
              {filteredAppointments.length > 0 ? (
                <div className="space-y-2">
                  {filteredAppointments.map(apt => (
                    <div key={apt.id} className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-smooth border border-border">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              apt.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                              apt.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                              'bg-blue-900/50 text-blue-400'
                            }`}>
                              {apt.status.toUpperCase()}
                            </span>
                            <span className="text-sm font-bold text-foreground">{apt.date}</span>
                            <span className="text-sm font-bold text-accent">{apt.time}</span>
                            {apt.duration && <span className="text-xs text-muted-foreground">({apt.duration} min)</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase">Client</p>
                              <p className="font-bold text-lg text-foreground">{apt.clientName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase">Agent</p>
                              <p className="font-bold text-lg text-foreground">{apt.agentName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase">Phone</p>
                              <p className="font-bold text-lg text-accent cursor-pointer hover:underline" onClick={() => navigator.clipboard.writeText(apt.phoneNumber)}>
                                {apt.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {apt.appointmentType && (
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <p className="font-bold text-foreground">{apt.appointmentType}</p>
                              </div>
                            )}
                            {apt.location && (
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <p className="font-bold text-foreground">{apt.location}</p>
                              </div>
                            )}
                          </div>
                          {apt.notes && (
                            <div className="mt-3 text-sm text-muted-foreground bg-background rounded px-3 py-2">
                              <span className="font-semibold">Notes:</span>
                              <p className="text-foreground">{apt.notes}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleEditAppointment(apt)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-smooth whitespace-nowrap"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleCompleteAppointment(apt.id)}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-smooth whitespace-nowrap"
                              >
                                ✓ Complete
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-smooth whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No appointments found matching your search' : 'No appointments yet'}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Today's Appointments */}
          <div className="w-80">
            <div className="bg-card border border-border rounded-2xl shadow-depth p-6 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                Today's Schedule
              </h3>

              <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
                <div className="text-sm text-muted-foreground mb-1">Total Appointments</div>
                <div className="text-4xl font-bold text-primary">{todayAppointments.length}</div>
              </div>

              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map(apt => (
                    <div key={apt.id} className="bg-accent/10 border border-accent rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-lg font-bold text-accent">{apt.time}</div>
                          <div className="text-xs text-muted-foreground">{apt.duration} min</div>
                        </div>
                        <span className="text-xs bg-accent text-primary-foreground px-2 py-1 rounded-full font-bold">Pending</span>
                      </div>
                      <div className="mb-3 pb-3 border-b border-accent/30">
                        <p className="font-bold text-lg text-foreground">{apt.clientName}</p>
                        <p className="text-sm text-accent font-semibold">{apt.agentName}</p>
                        <p className="text-sm text-muted-foreground cursor-pointer hover:text-accent transition-colors" onClick={() => navigator.clipboard.writeText(apt.phoneNumber)}>
                          📱 {apt.phoneNumber}
                        </p>
                      </div>
                      {apt.appointmentType && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-semibold">Type:</span> {apt.appointmentType}
                        </p>
                      )}
                      {apt.location && (
                        <p className="text-xs text-muted-foreground mb-3">
                          <span className="font-semibold">📍 Location:</span> {apt.location}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAppointment(apt)}
                          className="flex-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-smooth"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCompleteAppointment(apt.id)}
                          className="flex-1 px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-smooth"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-2xl mb-2">✨</p>
                  <p>No appointments today</p>
                  <p className="text-xs mt-1">Schedule is clear!</p>
                </div>
              )}

              {/* Statistics */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending:</span>
                  <span className="font-bold text-yellow-400">{appointments.filter(a => a.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-bold text-green-400">{appointments.filter(a => a.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cancelled:</span>
                  <span className="font-bold text-red-400">{appointments.filter(a => a.status === 'cancelled').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-4xl w-full h-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 sticky top-0 bg-card">
              {editingId ? '✏️ Edit Appointment' : '📝 New Appointment'}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
                <input
                  type="date"
                  autoFocus
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Client Name */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name (Client) *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Agent Name */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Agent Name *</label>
                <input
                  type="text"
                  placeholder="Agent Name"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+49 1234 567890"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Appointment Type</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Demo">Demo</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Sales Call">Sales Call</option>
                  <option value="Support">Support</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Location */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Berlin Office, Video Call, etc."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Notes / Additional Details</label>
                <textarea
                  placeholder="Add any notes about this appointment..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 sticky bottom-0 bg-card pt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                  setSelectedDate('');
                }}
                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-lg font-bold hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppointment}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-accent transition-smooth"
              >
                {editingId ? 'Update Appointment' : 'Create Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
