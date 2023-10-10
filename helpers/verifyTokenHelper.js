   // Verify the token
   jwt.verify(token, 'gcfgcgfcftcfctfctfctfctfctfcfcfcgfcghghcgcgcgccfccfcctrctcctct', (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error('Token verification failed:', err.message);
      // Handle authentication failure here
    } else {
      // Token is valid, and `decoded` contains the payload data
      console.log('Token verified. User data:', decoded);

      // You can use `decoded` to extract user information or perform other actions.
      // For example, if you stored user ID in the payload, you can access it like this:
      // const userId = decoded.userId;

      // Handle authentication success here
    }
  });