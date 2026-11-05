import { getEnquiries, updateEnquiryStatus } from '../_lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch Enquiries
  if (req.method === 'GET') {
    try {
      const { category, status, search } = req.query || {};
      const enquiries = getEnquiries({ category, status, search });

      // Compute statistics
      const all = getEnquiries({});
      const stats = {
        total: all.length,
        pending: all.filter((e) => e.status.toLowerCase() === 'pending').length,
        contacted: all.filter((e) => e.status.toLowerCase() === 'contacted').length,
        underReview: all.filter((e) => e.status.toLowerCase() === 'under review').length,
        completed: all.filter((e) => e.status.toLowerCase() === 'completed').length,
        verifiedRate: '100%',
      };

      return res.status(200).json({
        success: true,
        stats,
        count: enquiries.length,
        enquiries,
      });
    } catch (err) {
      console.error('[api/enquiries/list GET exception]', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch enquiries.' });
    }
  }

  // PATCH: Update Status
  if (req.method === 'PATCH' || req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { applicationId, status, note } = body;

      if (!applicationId || !status) {
        return res.status(400).json({ success: false, error: 'Application ID and new status are required.' });
      }

      const updated = updateEnquiryStatus(applicationId, status, note);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Application ${applicationId} not found.` });
      }

      return res.status(200).json({
        success: true,
        enquiry: updated,
        message: `Status updated to ${status}.`,
      });
    } catch (err) {
      console.error('[api/enquiries/list PATCH exception]', err);
      return res.status(500).json({ success: false, error: 'Failed to update enquiry status.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
