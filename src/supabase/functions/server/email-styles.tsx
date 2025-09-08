// Email styling constants and CSS-in-JS definitions for NBDAC email templates

export const EMAIL_STYLES = {
  // Container styles
  container: "font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; background-color: #ffffff !important;",
  
  // Header styles - Multiple background declarations for maximum Outlook compatibility
  header: {
    main: "background: #ffffff; background-color: #ffffff !important; border: 3px solid #2563eb; border-bottom: none; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;",
    titleSection: "background: #ffffff; background-color: #ffffff !important; text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 15px;",
    title: "background: transparent; margin: 0; font-size: 24px; font-weight: 600; color: #1e293b;",
    subtitle: "background: transparent; margin: 0; font-size: 20px; font-weight: 500; text-align: center; color: #2563eb;",
    projectName: "background: transparent; margin: 8px 0 0 0; text-align: center; font-size: 16px; color: #374151; font-weight: 600;"
  },
  
  // Main content styles - Multiple background declarations for Outlook compatibility
  content: {
    wrapper: "background: #ffffff; background-color: #ffffff !important; border: 3px solid #2563eb; border-top: none; border-bottom: none; padding: 30px;",
    innerWrapper: "background: white; background-color: white !important; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);",
    greeting: "margin: 0 0 20px 0; font-size: 16px; color: #374151;",
    introText: "margin: 0 0 25px 0; font-size: 16px; color: #374151; line-height: 1.6;"
  },
  
  // Section styles - Multiple background declarations for Outlook compatibility
  section: {
    details: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #3b82f6; border-radius: 6px; padding: 20px; margin: 20px 0;",
    purpose: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #3b82f6; border-radius: 6px; padding: 20px; margin: 20px 0;",
    website: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #16a34a; border-radius: 6px; padding: 20px; margin: 20px 0;",
    notes: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 20px 0;",
    action: "background: #ffffff; background-color: #ffffff !important; border: 3px solid #dc2626; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0;",
    system: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #6b7280; border-radius: 6px; padding: 20px; margin: 20px 0;"
  },
  
  // Header styles for sections
  sectionHeaders: {
    details: "margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;",
    purpose: "margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;",
    website: "margin: 0 0 10px 0; color: #15803d; font-size: 16px; font-weight: 600;",
    notes: "margin: 0 0 10px 0; color: #d97706; font-size: 16px; font-weight: 600;",
    action: "margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center; color: #dc2626;",
    system: "margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;"
  },
  
  // Table styles
  table: {
    main: "width: 100%; border-collapse: collapse; font-size: 14px;",
    row: "border-bottom: 1px solid #e5e7eb;",
    labelCell: "padding: 12px 0; font-weight: 600; color: #374151; width: 35%;",
    valueCell: "padding: 12px 0; color: #1f2937;",
    systemTable: "width: 100%; font-size: 13px; color: #4b5563;",
    systemLabelCell: "padding: 4px 0; font-weight: 600;",
    systemValueCell: "padding: 4px 0; font-family: 'Courier New', monospace; font-weight: 600; color: #1f2937;"
  },
  
  // Status badge styles
  statusBadge: "border: 2px solid #f59e0b; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #ffffff; background-color: #ffffff !important;",
  
  // Website URL display styles
  websiteUrlDisplay: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #16a34a; border-radius: 4px; padding: 12px; font-family: 'Courier New', monospace; font-size: 13px; color: #15803d; word-break: break-all;",
  
  // Action section styles - Multiple background declarations for Outlook compatibility
  actionText: "margin: 0 0 15px 0; font-size: 16px; text-align: center; color: #374151;",
  actionSteps: {
    container: "background: #ffffff; background-color: #ffffff !important; border: 2px solid #f87171; padding: 15px; margin: 15px 0; border-radius: 6px;",
    header: "margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #dc2626;",
    list: "margin: 0; padding-left: 20px; line-height: 1.8; color: #374151;"
  },
  
  // Footer styles - Working pattern for Outlook (reference pattern)
  footer: {
    main: "background: #ffffff; background-color: #ffffff !important; border: 3px solid #2563eb; border-top: none; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;",
    title: "margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #2563eb;",
    subtitle: "margin: 0; font-size: 12px; color: #4b5563;"
  },
  
  // Text content styles
  text: {
    paragraph: "margin: 0; color: #374151; line-height: 1.6; font-size: 14px;"
  }
} as const;