import { Box, AppBar, Toolbar, Typography, Button, Container, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, ListItemIcon } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GroupsIcon from '@mui/icons-material/Groups';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const getMenuItems = () => {
    if (token) {
      return [
        { text: 'Accueil', path: '/', icon: <HomeIcon /> },
        { text: 'Ma Collection', path: '/collection', icon: <CollectionsIcon /> },
        { text: 'Factions', path: '/factions', icon: <GroupsIcon /> },
        { text: 'Armées', path: '/armies', icon: <MilitaryTechIcon /> },
      ];
    }
    return [
      { text: 'Accueil', path: '/', icon: <HomeIcon /> },
      { text: 'Connexion', path: '/login', icon: <LoginIcon /> },
      { text: 'Inscription', path: '/register', icon: <HowToRegIcon /> },
    ];
  };

  const menuItems = getMenuItems();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          key={item.text} 
          component={Link} 
          to={item.path}
          onClick={handleDrawerToggle}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'background.default',
            },
            cursor: 'pointer'
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            sx={{
              color: 'text.primary',
            }}
          />
        </ListItem>
      ))}
      {token && (
        <ListItem 
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'background.default',
            },
            cursor: 'pointer'
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Déconnexion"
            sx={{
              color: 'text.primary',
            }}
          />
        </ListItem>
      )}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'primary.main' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
            }}
          >
            WARHAMMER 40K COLLECTION
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
              {token && (
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Déconnexion
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'background.default',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            Pour la gloire de l'Empereur ! © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 