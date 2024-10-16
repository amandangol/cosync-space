'use client'

import React, { useEffect, useState } from 'react'
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui'
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useUpdateRoomNotificationSettings,
} from '@liveblocks/react/suspense'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Bell } from 'lucide-react'

const Notification = () => {
  const { inboxNotifications } = useInboxNotifications()
  const updateRoomNotificationSettings = useUpdateRoomNotificationSettings()
  const { count } = useUnreadInboxNotificationsCount()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    updateRoomNotificationSettings({ threads: 'all' })
  }, [updateRoomNotificationSettings])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Bell size={20} />
          {count > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[400px] overflow-y-auto p-0">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <InboxNotificationList>
            {inboxNotifications.length > 0 ? (
              inboxNotifications.map(inboxNotification => (
                <div key={inboxNotification.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                  <InboxNotification
                    inboxNotification={inboxNotification}
                  />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </InboxNotificationList>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notification