window.addEventListener('beforeunload', async function (event) {
    console.log("HERE 23");
  
    try {
      const response = await fetch('/keep-signed-in');
      const result = await response.json();
  
      if (!result.keepSignedIn) {
        const logoutResponse = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logoutOnClose: true }),
        });
  
        if (logoutResponse.ok) {
          console.log('Logout successful');
        } else {
          console.error('Logout failed:', logoutResponse.statusText);
        }
      }
    } catch (error) {
      // An error occurred during the fetch request
      console.error('Error checking "Keep me Signed in" status:', error);
    }
  });
  