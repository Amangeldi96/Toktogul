  export const galleryModal = {
	position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

export const galleryClose = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  fontSize: '24px',
  color: '#fff',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
};

export const galleryCounter = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  color: '#fff',
  fontSize: '14px',
};

export const galleryTrack = {
  display: 'flex',
  width: '100%',
  height: '100%',
  transition: 'transform 0.3s ease',
};

export const gallerySlide = {
  minWidth: '100vw',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const galleryImg = {
  maxWidth: '90%',
  maxHeight: '90%',
  borderRadius: 8,
};

export const galleryVideo = {
  maxWidth: '90%',
  maxHeight: '90%',
  borderRadius: 8,
};

export const galleryBtn = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '32px',
  color: '#fff',
  background: 'rgba(0,0,0,0.4)',
  border: 'none',
  borderRadius: '50%',
  width: 48,
  height: 48,
  cursor: 'pointer',
};

export const galleryBtnLeft = {
  left: '16px',
};

export const galleryBtnRight = {
  right: '16px',
};
