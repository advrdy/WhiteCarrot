# Google Calendar Events Manager
**Deployed Link: https://white-carrot.vercel.app/**

A web application to manage Google Calendar events. Users can view, create, filter, and delete events from their Google Calendar. Built with React, Supabase for authentication, and Tailwind CSS for styling.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/google-calendar-events-manager.git
cd google-calendar-events-manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root of the project and add the following variables:

**VITE_SUPABASE_URL=your-supabase-url**

**VITE_SUPABASE_ANON_KEY=your-supabase-anon-key**

Replace your-supabase-url with your Supabase project URL.
Replace your-supabase-anon-key with your Supabase anonymous key.

### 4. Enable Google Calendar API
Go to the **Google Cloud Console.**
Enable the **Google Calendar API** for your project.
Add the required **OAuth credentials** in Supabase to enable Google Sign-In.

### 5. Start the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:5173.

## Features
- **Google Sign-In**: Authenticate with your Google account using Supabase.
- **View Events**: Display a list of events from your Google Calendar.
- **Create Events**: Add new events with start and end dates, names, and descriptions.
- **Filter Events**: Filter events based on specific dates.
- **Delete Events**: Remove events directly from your Google Calendar.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Authentication**: Supabase
- **API**: Google Calendar API
- **State Management**: React Hooks
