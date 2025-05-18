import { 
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BlogPost } from '../types/blog';

export type ExamType = 'upsc' | 'tgpsc' | 'appsc' | 'all';



/**
 * Get current affairs for a specific exam type
 */
export const getCurrentAffairsByExam = async (examType: ExamType): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    
    // If examType is 'all', don't filter by exam type
    const examFilter = examType === 'all' ? [] : [where('examType', '==', examType)];
    
    try {
      // First try with the full query with ordering
      const q = query(
        postsRef,
        where('published', '==', true),
        where('isCurrentAffair', '==', true),
        ...examFilter,
        orderBy('currentAffairDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      
      // If we got posts, return them
      if (posts.length > 0) {
        return posts;
      }
      
      // If no posts found via index, try simpler query without ordering
      const qSimple = query(
        postsRef,
        where('published', '==', true),
        where('isCurrentAffair', '==', true),
        ...examFilter
      );
      
      const snapshotSimple = await getDocs(qSimple);
      const postsSimple = snapshotSimple.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      
      if (postsSimple.length > 0) {
        // Sort manually if we got posts
        return postsSimple.sort((a, b) => {
          const dateA = a.currentAffairDate || 0;
          const dateB = b.currentAffairDate || 0;
          return dateB - dateA;
        });
      }
    } catch (indexError) {
      console.error('Error with indexed query:', indexError);
      // Fall through to sample data
    }
    
    // If still no posts, return sample data
    console.log('No current affairs found, returning sample data');
    return getSampleCurrentAffairs(examType);
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    return getSampleCurrentAffairs(examType);
  }
};

/**
 * Get unique dates for current affairs by exam type
 */
export const getCurrentAffairsDates = async (examType: ExamType): Promise<{ date: number; count: number }[]> => {
  try {
    const posts = await getCurrentAffairsByExam(examType);
    
    // Group posts by date and count them
    const dateMap = new Map<number, number>();
    
    posts.forEach(post => {
      if (post.currentAffairDate) {
        // Convert to date string (YYYY-MM-DD) to group by day
        const date = new Date(post.currentAffairDate);
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const dateTimestamp = new Date(dateString).getTime();
        
        const count = dateMap.get(dateTimestamp) || 0;
        dateMap.set(dateTimestamp, count + 1);
      }
    });
    
    // Convert map to array and sort by date (descending)
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Error fetching current affairs dates:', error);
    return [];
  }
};

/**
 * Get current affairs for a specific date and exam type
 */
export const getCurrentAffairsByDate = async (date: number, examType: ExamType): Promise<BlogPost[]> => {
  try {
    // Get all posts for the exam type
    const posts = await getCurrentAffairsByExam(examType);
    
    // Filter by date (same day)
    return posts.filter(post => {
      if (!post.currentAffairDate) return false;
      
      const postDate = new Date(post.currentAffairDate);
      const targetDate = new Date(date);
      
      return postDate.getFullYear() === targetDate.getFullYear() &&
             postDate.getMonth() === targetDate.getMonth() &&
             postDate.getDate() === targetDate.getDate();
    });
  } catch (error) {
    console.error('Error fetching current affairs by date:', error);
    return [];
  }
};

// Sample current affairs for development and testing
const getSampleCurrentAffairs = (examType: ExamType): BlogPost[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000; // One day in milliseconds
  
  const samplePosts: BlogPost[] = [
    // UPSC Current Affairs
    {
      id: 'sample-upsc-ca-1',
      title: 'Union Budget 2024-25 Highlights',
      slug: 'union-budget-2024-25-highlights',
      content: '<p>Finance Minister presented the Union Budget 2024-25 in Parliament today. Key highlights include...</p>',
      excerpt: 'Key highlights from the Union Budget 2024-25 focusing on economic growth, tax reforms, and infrastructure development.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'upsc',
      currentAffairDate: now - (day * 1),
      createdAt: now - (day * 1),
      updatedAt: now - (day * 1)
    },
    {
      id: 'sample-upsc-ca-2',
      title: 'National Education Policy Implementation',
      slug: 'national-education-policy-implementation',
      content: '<p>The government has announced new measures to accelerate the implementation of the National Education Policy...</p>',
      excerpt: 'New measures announced to accelerate the implementation of the National Education Policy across states.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'upsc',
      currentAffairDate: now - (day * 2),
      createdAt: now - (day * 2),
      updatedAt: now - (day * 2)
    },
    {
      id: 'sample-upsc-ca-3',
      title: 'India-EU Trade Agreement',
      slug: 'india-eu-trade-agreement',
      content: '<p>India and the European Union have finalized a comprehensive trade agreement after years of negotiations...</p>',
      excerpt: 'India and the European Union finalize a comprehensive trade agreement to boost bilateral trade and investment.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'upsc',
      currentAffairDate: now - (day * 2),
      createdAt: now - (day * 2),
      updatedAt: now - (day * 2)
    },
    
    // TGPSC Current Affairs
    {
      id: 'sample-tgpsc-ca-1',
      title: 'Telangana Irrigation Project Inauguration',
      slug: 'telangana-irrigation-project-inauguration',
      content: '<p>The Chief Minister of Telangana inaugurated a major irrigation project that will benefit farmers across several districts...</p>',
      excerpt: 'Telangana CM inaugurates major irrigation project benefiting farmers across multiple districts.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'tgpsc',
      currentAffairDate: now - (day * 1),
      createdAt: now - (day * 1),
      updatedAt: now - (day * 1)
    },
    {
      id: 'sample-tgpsc-ca-2',
      title: 'Telangana Digital Literacy Program',
      slug: 'telangana-digital-literacy-program',
      content: '<p>The Telangana government has launched a comprehensive digital literacy program aimed at rural areas...</p>',
      excerpt: 'Telangana government launches comprehensive digital literacy program targeting rural areas.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'tgpsc',
      currentAffairDate: now - (day * 3),
      createdAt: now - (day * 3),
      updatedAt: now - (day * 3)
    },
    
    // APPSC Current Affairs
    {
      id: 'sample-appsc-ca-1',
      title: 'Andhra Pradesh Industrial Policy 2024',
      slug: 'andhra-pradesh-industrial-policy-2024',
      content: '<p>The Andhra Pradesh government has announced a new industrial policy to attract investments and create jobs...</p>',
      excerpt: 'Andhra Pradesh government announces new industrial policy to boost investment and job creation.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'appsc',
      currentAffairDate: now - (day * 1),
      createdAt: now - (day * 1),
      updatedAt: now - (day * 1)
    },
    {
      id: 'sample-appsc-ca-2',
      title: 'Andhra Pradesh Healthcare Initiatives',
      slug: 'andhra-pradesh-healthcare-initiatives',
      content: '<p>The state government has launched several healthcare initiatives to improve medical services in rural areas...</p>',
      excerpt: 'Andhra Pradesh government launches healthcare initiatives to improve medical services in rural areas.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      examType: 'appsc',
      currentAffairDate: now - (day * 4),
      createdAt: now - (day * 4),
      updatedAt: now - (day * 4)
    }
  ];
  
  // Filter by exam type if specified
  if (examType !== 'all') {
    return samplePosts.filter(post => post.examType === examType);
  }
  
  return samplePosts;
};
