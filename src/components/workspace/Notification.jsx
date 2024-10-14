'use client'

import { useEffect } from 'react'
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

const Notification = ({ children }) => {
  const { inboxNotifications } = useInboxNotifications()
  const updateRoomNotificationSettings = useUpdateRoomNotificationSettings()
  const { count, error, isLoading } = useUnreadInboxNotificationsCount()

  useEffect(() => {
    updateRoomNotificationSettings({ threads: 'all' })
  }, [])

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-1">
          {children}{' '}
          <span className="-ml-3 rounded-full bg-primary p-1 px-2 text-[7px] text-white">
            {count}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className={'w-[500px]'}>
        <InboxNotificationList>
          {inboxNotifications.map(inboxNotification => (
            <InboxNotification
              key={inboxNotification.id}
              inboxNotification={inboxNotification}
            />
          ))}
        </InboxNotificationList>
      </PopoverContent>
    </Popover>
  )
}

export default Notification
