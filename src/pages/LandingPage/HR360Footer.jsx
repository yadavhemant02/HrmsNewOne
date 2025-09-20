import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Grid, Typography, Box, Button } from '@mui/material';
import { 
  YouTube as YouTubeIcon, 
  LinkedIn as LinkedInIcon, 
  Twitter as TwitterIcon, 
  Facebook as FacebookIcon,
  Android as AndroidIcon,
  Apple as AppleIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

const FooterContainer = styled(Box)`
  padding: 80px 0;
  background-color: #0f172a;
  color: #ffffff;
  padding-left: 20px;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 20px;
  }
`;

const FooterSection = styled(Grid)`
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled(Typography)`
  color: #2196f3;  
  font-weight: 700;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Typography)`
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  display: block;
  
  &:hover {
    color: #2196f3;
    text-decoration: underline;
    transform: translateX(4px);
  }
  
  &:focus {
    outline: 2px solid #2196f3;
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  &:active {
    transform: translateX(2px);
  }
`;

const SocialIconContainer = styled(Box)`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #ffffff;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #2196f3;
  }
`;

const AppDownloadContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const AppStoreButton = styled(Button)`
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px 16px;
  text-transform: none;
  font-size: 0.875rem;
  min-width: 140px;
  height: 48px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a2a2a;
    border-color: #2196f3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .icon {
    margin-right: 8px;
    font-size: 20px;
  }
  
  .text-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }
  
  .small-text {
    font-size: 0.7rem;
    opacity: 0.8;
  }
  
  .main-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const AppImageButton = styled.img`
  height: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0) scale(1);
  }
`;

const ClickableText = styled(Typography)`
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2196f3;
    text-decoration: underline;
  }
`;

const HR360Footer = () => {
  const navigate = useNavigate();

  // Navigation configuration
  const navigationConfig = {
    // Product section links
    product: [
      { label: 'Overview', path: '/product/overview', type: 'internal' },
      { label: 'Features', path: '/product/features', type: 'internal' },
      { label: 'Integrations', path: '/product/integrations', type: 'internal' }
    ],
    
    // Solutions section links
    solutions: [
      { label: 'Recruitment', path: 'recruitment', type: 'internal' },
      { label: 'Onboarding', path: 'onboarding', type: 'internal' },
      { label: 'Performance Management', path: 'performance', type: 'internal' },
      { label: 'Attendance Management', path: 'attendanceland', type: 'internal' }
    ],
    
    // Legal/Policy links
    legal: [
      { label: 'Privacy Policy', path: '/privacy-policy', type: 'internal' },
      { label: 'Terms of Service', path: '/terms-of-service', type: 'internal' },
      { label: 'Cookie Settings', path: '#cookie-settings', type: 'action' }
    ],
    
    // Social media links
    social: [
      { platform: 'youtube', url: 'https://youtube.com/hraat' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/hraat' },
      { platform: 'twitter', url: 'https://twitter.com/hraat' },
      { platform: 'facebook', url: 'https://facebook.com/hraat' }
    ],
    
    // App download links with enhanced configuration
    apps: [
      { 
        platform: 'google-play', 
        url: 'https://play.google.com/store/apps/details?id=com.hraat',
        name: 'Google Play',
        imagePath: '/assets/images/google-play-badge.png',
        fallbackIcon: AndroidIcon,
        mainText: 'Google Play',
        subText: 'Get it on'
      },
      { 
        platform: 'app-store', 
        url: 'https://apps.apple.com/app/hraat',
        name: 'App Store',
        imagePath: '/assets/images/app-store-badge.png',
        fallbackIcon: AppleIcon,
        mainText: 'App Store',
        subText: 'Download on the'
      }
    ]
  };

  /**
   * Scrolls to top of the page
   */
  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      try {
        window.scrollTo(0, 0);
      } catch (fallbackError) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  };

  /**
   * Handles navigation for internal routes
   * @param {string} path - The route path
   */
  const handleInternalNavigation = (path) => {
    try {
      scrollToTop();
      navigate(path);
      setTimeout(() => {
        scrollToTop();
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
      scrollToTop();
      window.location.href = path;
    }
  };

  /**
   * Handles external link clicks
   * @param {string} url - The external URL
   */
  const handleExternalLink = (url) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('External link error:', error);
    }
  };

  /**
   * Handles special actions (like cookie settings)
   * @param {string} action - The action type
   */
  const handleSpecialAction = (action) => {
    switch (action) {
      case '#cookie-settings':
        console.log('Opening cookie settings...');
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  /**
   * Generic click handler for all footer links
   * @param {Object} item - The navigation item
   */
  const handleClick = (item) => {
    switch (item.type) {
      case 'internal':
        handleInternalNavigation(item.path);
        break;
      case 'external':
        handleExternalLink(item.path);
        break;
      case 'action':
        handleSpecialAction(item.path);
        break;
      default:
        console.warn(`Unknown navigation type: ${item.type}`);
    }
  };

  /**
   * Handles keyboard navigation
   * @param {KeyboardEvent} event 
   * @param {Object} item 
   */
  const handleKeyPress = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(item);
    }
  };

  /**
   * Handles social media clicks
   * @param {string} url - Social media URL
   */
  const handleSocialClick = (url) => {
    handleExternalLink(url);
  };

  /**
   * Handles app download clicks
   * @param {string} url - App store URL
   */
  const handleAppDownload = (url) => {
    handleExternalLink(url);
  };

  /**
   * App Store Button Component with fallback
   */
  const AppStoreButtonComponent = ({ app }) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    
    const handleImageError = () => {
      setImageError(true);
    };
    
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
    
    // If image failed to load or hasn't loaded yet, show icon button
    if (imageError || !imageLoaded) {
      const IconComponent = app.fallbackIcon;
      
      return (
        <AppStoreButton
          onClick={() => handleAppDownload(app.url)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAppDownload(app.url);
            }
          }}
          aria-label={`Download app from ${app.name}`}
          role="button"
          tabIndex={0}
        >
          <IconComponent className="icon" />
          <Box className="text-content">
            <Typography className="small-text">{app.subText}</Typography>
            <Typography className="main-text">{app.mainText}</Typography>
          </Box>
        </AppStoreButton>
      );
    }
    
    // If image loaded successfully, show the image
    return (
      <Box sx={{ display: 'none' }}>
        <AppImageButton
          src={app.imagePath}
          alt={`Download from ${app.name}`}
          onClick={() => handleAppDownload(app.url)}
          onError={handleImageError}
          onLoad={handleImageLoad}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAppDownload(app.url);
            }
          }}
          aria-label={`Download app from ${app.name}`}
        />
      </Box>
    );
  };

  return (
    <FooterContainer>
      <Grid container spacing={4}>
        {/* Company Information */}
        <Grid item xs={12} md={4}>
          <FooterTitle variant="h6">HRHaaT</FooterTitle>
          <Typography variant="body2" color="inherit" sx={{ mb: 2 }}>
            HRHaaT is a comprehensive HR management solution designed to streamline 
            your human resources processes. We help organizations optimize their 
            HR operations, improve employee experiences, and drive organizational efficiency.
          </Typography>
          
          <SocialIconContainer>
            {navigationConfig.social.map((social) => (
              <SocialIcon 
                key={social.platform}
                onClick={() => handleSocialClick(social.url)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSocialClick(social.url);
                  }
                }}
                aria-label={`Visit our ${social.platform} page`}
              >
                {social.platform === 'youtube' && <YouTubeIcon />}
                {social.platform === 'linkedin' && <LinkedInIcon />}
                {social.platform === 'twitter' && <TwitterIcon />}
                {social.platform === 'facebook' && <FacebookIcon />}
              </SocialIcon>
            ))}
          </SocialIconContainer>
        </Grid>

        {/* Product Links */}
        <Grid item xs={12} md={2}>
          <FooterTitle variant="h6">Product</FooterTitle>
          {navigationConfig.product.map((item, index) => (
            <FooterLink
              key={index}
              variant="body2"
              onClick={() => handleClick(item)}
              onKeyPress={(e) => handleKeyPress(e, item)}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </FooterLink>
          ))}
        </Grid>

        {/* Solutions */}
        <Grid item xs={12} md={2}>
          <FooterTitle variant="h6">Solutions</FooterTitle>
          {navigationConfig.solutions.map((item, index) => (
            <FooterLink
              key={index}
              variant="body2"
              onClick={() => handleClick(item)}
              onKeyPress={(e) => handleKeyPress(e, item)}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </FooterLink>
          ))}
        </Grid>

        {/* Contact Information & App Downloads */}
        <Grid item xs={12} md={4}>
          <FooterTitle variant="h6">Contact Us</FooterTitle>
          <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
            Sales: 
            <ClickableText 
              component="span" 
              onClick={() => handleExternalLink('mailto:hrhaat@kpro.co.in')}
              sx={{ ml: 1 }}
            >
              hrhaat@kpro.co.in
            </ClickableText>
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
            Support: 
            <ClickableText 
              component="span" 
              onClick={() => handleExternalLink('mailto:hrhaat@kpro.co.in')}
              sx={{ ml: 1 }}
            >
              hrhaat@kpro.co.in
            </ClickableText>
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
            Phone: 
            <ClickableText 
              component="span" 
              onClick={() => handleExternalLink('tel:9403621934')}
              sx={{ ml: 1 }}
            >
              9403621934
            </ClickableText>
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mb: 2 }}>
            Address: The Hive at VR, 
            Bengaluru, ITPL Main Road, Mahadevpura 
            Bengaluru - 560048, India
          </Typography>

          {/* App Download Section */}
       
          <AppDownloadContainer>
            {navigationConfig.apps.map((app) => (
              <AppStoreButtonComponent key={app.platform} app={app} />
            ))}
          </AppDownloadContainer>

          {/* Hidden images for preloading */}
          {navigationConfig.apps.map((app) => (
            <img 
              key={`preload-${app.platform}`}
              src={app.imagePath}
              alt=""
              style={{ display: 'none' }}
              onLoad={() => console.log(`${app.name} image loaded`)}
              onError={() => console.log(`${app.name} image failed to load`)}
            />
          ))}
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}
      >
        <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
          © 2024 Kpro Solutions Pvt.Ltd(HRHaaT). All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {navigationConfig.legal.map((item, index) => (
            <ClickableText
              key={index}
              variant="body2"
              onClick={() => handleClick(item)}
              onKeyPress={(e) => handleKeyPress(e, item)}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </ClickableText>
          ))}
        </Box>
      </Box>
    </FooterContainer>
  );
};

export default HR360Footer;