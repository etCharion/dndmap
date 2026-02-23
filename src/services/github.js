export const getRepoInfo = () => {
  const url = window.location.href;

  // Example for GitHub Pages: https://username.github.io/repo/
  const ghPagesMatch = url.match(/https:\/\/([^.]+)\.github\.io\/([^/]+)/);
  if (ghPagesMatch) {
    return { owner: ghPagesMatch[1], repo: ghPagesMatch[2] };
  }

  // Example for local development or direct repo access if we can infer it
  // In a real scenario, we might want to allow setting this in settings
  // For now, let's try to parse from the window location if it's on github.com
  const ghRepoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (ghRepoMatch) {
    return { owner: ghRepoMatch[1], repo: ghRepoMatch[2].replace('.git', '') };
  }

  // Fallback for development - user can set these in localStorage or we can use defaults
  return {
    owner: localStorage.getItem('gh_owner') || '',
    repo: localStorage.getItem('gh_repo') || ''
  };
};

export const fetchFiles = async (path) => {
  const { owner, repo } = getRepoInfo();
  if (!owner || !repo) {
    console.warn('GitHub owner or repo not found. Please set them in Admin.');
    return [];
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch files from ${path}`);
    }
    const data = await response.json();

    // GitHub returns an array of file objects
    return data
      .filter(file => file.type === 'file')
      .map(file => ({
        name: file.name,
        path: file.path,
        url: file.download_url, // Direct link to raw content
      }));
  } catch (error) {
    console.error('Error fetching files from GitHub:', error);
    return [];
  }
};
