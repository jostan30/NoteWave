import { useState } from 'react';
import { Button, Typography, Box, IconButton, Card, CardContent } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext'; // Adjust path as needed

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Note 1', createdAt: new Date() },
    { id: '2', title: 'Note 2', createdAt: new Date() }
  ]);

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: `Note ${notes.length + 1}`,
      createdAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bg: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
          </div>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
            Dashboard
          </Typography>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="text"
          onClick={handleSignOut}
          sx={{
            color: '#3b82f6',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: '400px', mx: 'auto', p: 3 }}>
        {/* Welcome Card */}
        <Card sx={{ mb: 3, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
              Welcome, {user?.name || 'Jonas Kahnwald'} !
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Email: {user?.email || 'xxxxxx@xxxx.com'}
            </Typography>
          </CardContent>
        </Card>

        {/* Create Note Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreateNote}
          sx={{
            mb: 3,
            backgroundColor: '#3b82f6',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          Create Note
        </Button>

        {/* Notes Section */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
          Notes
        </Typography>

        {/* Notes List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notes.map((note) => (
            <Card
              key={note.id}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  '&:last-child': { pb: 2 },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#111827' }}>
                  {note.title}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteNote(note.id)}
                  sx={{
                    color: '#6b7280',
                    '&:hover': {
                      color: '#ef4444',
                      backgroundColor: '#fef2f2',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Empty State */}
        {notes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No notes yet. Create your first note!
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}