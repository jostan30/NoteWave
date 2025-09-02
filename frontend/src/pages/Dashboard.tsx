import { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext';
import { useToast } from '../component/Toast';

interface Note {
  _id: string;
  title: string;
  content?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotes(data);
        showToast('Notes loaded successfully', 'success', 2000);
      } else {
        showToast(data.message || 'Failed to fetch notes', 'error');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const handleSignOut = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/signin');
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setNoteTitle('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNoteTitle('');
  };

  const handleCreateNote = async () => {
    if (!noteTitle.trim()) {
      showToast('Please enter a note title', 'warning');
      return;
    }

    try {
      setCreating(true);

      const response = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteTitle.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotes(prev => [...prev, data]);
        showToast('Note created successfully! ', 'success');
        handleCloseDialog();
      } else {
        showToast(data.message || 'Failed to create note', 'error');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotes(prev => prev.filter(note => note._id !== noteId));
        showToast(`"${noteTitle}" deleted successfully`, 'success');
      } else {
        showToast(data.message || 'Failed to delete note', 'error');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCreateNote();
    }
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
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '6px',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: '600px', mx: 'auto', p: 3 }}>
        {/* Welcome Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  mb: 1,
                  fontSize: { xs: "17px", sm: "23px", lg: "26px" }, // 👈 responsive font size
                }}
              >
                Welcome back, {user?.name || "User"}!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  fontSize: { xs: "14px", sm: "14px", lg: "16px" }, // 👈 smaller on mobile
                }}
              >
                Email: {user?.email || "xxxxxx@xxxx.com"}
              </Typography>
            </Box>

          </CardContent>
        </Card>


        {/* Create Note Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
            sx={{
              width: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#2563eb',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            New Note
          </Button>
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            {/* Notes List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {notes.map((note) => (
                <Card
                  key={note._id}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 3,
                      '&:last-child': { pb: 3 },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                        {note.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Created {new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteNote(note._id, note.title)}
                      sx={{
                        color: '#9ca3af',
                        borderRadius: '8px',
                        '&:hover': {
                          color: '#ef4444',
                          backgroundColor: '#fef2f2',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Empty State */}
            {notes.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#6b7280', mb: 2, fontWeight: 500 }}>
                  No notes yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                  Create your first note to get started!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleOpenDialog}
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                    },
                  }}
                >
                  Create Note
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Create Note Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', p: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 2, fontSize: '20px', fontWeight: 600 }}>
          Create New Note
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note Title"
            fullWidth
            variant="outlined"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your note title..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: 'none',
              color: '#6b7280',
              borderRadius: '8px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            variant="contained"
            disabled={creating || !noteTitle.trim()}
            sx={{
              textTransform: 'none',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                backgroundColor: '#2563eb',
              },
              '&:disabled': {
                backgroundColor: '#94a3b8',
              },
            }}
          >
            {creating ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                Creating...
              </>
            ) : (
              'Create Note'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}