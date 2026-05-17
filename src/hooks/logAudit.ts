import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const logChange = (collectionName: string): CollectionAfterChangeHook => 
  async ({ doc, req, operation, previousDoc }) => {
    // If there is no user, skip (could be system action)
    if (!req.user) return doc

    // Skip if it's already an audit log action (prevent infinite loops, though unlikely)
    if (req.context?.skipAudit) return doc

    const docId = doc.id?.toString() || doc._id?.toString()
    const docTitle = doc.title || doc.name || doc.fullName || docId

    let action: 'create' | 'update' | 'delete' | 'publish' = operation === 'create' ? 'create' : 'update'
    
    // Check if drafts are enabled and document is published
    // In our project, drafts aren't yet enabled, so we treat create/update as published/publish
    // The user specifically mentioned "when user publishes his changes"
    // For collections without versions, every change is a "publish" in essence
    if ((doc as any)._status === 'published' && (previousDoc as any)?._status !== 'published') {
      action = 'publish'
    } else if ((doc as any)._status === 'published') {
      // It's still a published state change
      action = 'publish'
    }

    try {
      await req.payload.create({
        collection: 'audit-logs',
        data: {
          user: req.user.id,
          collectionName,
          docId,
          docTitle,
          action,
        },
        req, // Transaction safety
        context: { skipAudit: true }, // Prevent recursive logging
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      req.payload.logger.error(`Failed to create audit log: ${message}`)
    }

    return doc
  }

export const logDelete = (collectionName: string): CollectionAfterDeleteHook => 
  async ({ doc, req, id }) => {
    if (!req.user) return

    try {
      const docTitle = (doc as any).title || (doc as any).name || (doc as any).fullName || id?.toString()

      await req.payload.create({
        collection: 'audit-logs',
        data: {
          user: req.user.id,
          collectionName,
          docId: id?.toString(),
          docTitle,
          action: 'delete',
        },
        req,
        context: { skipAudit: true },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      req.payload.logger.error(`Failed to create audit log for deletion: ${message}`)
    }
  }
