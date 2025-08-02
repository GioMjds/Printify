'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { navbar } from '@/constants/navbar';
import { logout } from '@/services/Auth';
import { useNavbarNotifications } from '@/hooks/useNavbarNotifications';
import { NavbarProps } from '@/types/Navbar';
import { formatNotificationTime } from '@/utils/notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Bell, BellDot, Cloud, LogIn, LogOut, User2Icon, UserRoundPlus } from 'lucide-react';
import { faCloud, faUpload } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/components/Dropdown';
import Modal from '@/components/Modal';
import ProfileIcon from '@/components/ProfileIcon';

export default function Navbar({ userDetails }: NavbarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        hasUnread,
        isLoading: notificationsLoading,
        markAsRead,
        markAllAsRead
    } = useNavbarNotifications();

    const router = useRouter();
    const pathname = usePathname();

    const itemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 },
        },
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            router.prefetch('/');
            router.refresh();
            setShowLogoutModal(false);
        } catch (error) {
            console.error(`Logout failed: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await markAsRead(notificationId);
        } catch (error) {
            console.error(`Failed to mark notification as read: ${error}`);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error(`Failed to mark all notifications as read: ${error}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <motion.div
                        className="flex-shrink-0"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link prefetch={false} href="/" className="flex items-center space-x-2">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                <Image
                                    src="/printify_logo.png"
                                    alt="Printify Logo"
                                    fill
                                    sizes='auto'
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-highlight drop-shadow-md">
                                Printify
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.div
                        className="hidden lg:flex items-center space-x-4"
                        variants={itemVariants}
                    >
                        {userDetails &&
                            navbar.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative group text-base font-medium nav-link px-4 py-3 rounded-full transition-colors duration-200 
                                        ${isActive ? 'bg-accent text-bg-white shadow-md'
                                                : 'text-highlight hover:text-bg-accent'}
                                    `}
                                    >
                                        {item.icon && (
                                            <>
                                                <FontAwesomeIcon icon={item.icon} size='lg' />
                                                <span className="absolute left-1/2 -translate-x-1/2 top-[105%] mb-2 w-max px-2 py-1 rounded bg-gray-900 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                                    {item.name}
                                                </span>
                                            </>
                                        )}
                                    </Link>
                                );
                            })
                        }
                        {userDetails && (
                            <div className="relative" ref={notificationRef}>
                                <motion.button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative group cursor-pointer p-3 text-highlight rounded-full transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {hasUnread ? (
                                        <BellDot className="w-5 h-5" />
                                    ) : (
                                        <Bell className="w-5 h-5" />
                                    )}
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </motion.button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-border-light z-50 max-h-96 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-border-light">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-primary">
                                                    Notifications
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={handleMarkAllAsRead}
                                                            className="text-sm text-accent hover:text-primary transition-colors"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto">
                                            {notificationsLoading ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                                                    <p className="mt-2 text-sm">Loading notifications...</p>
                                                </div>
                                            ) : notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p>No notifications yet</p>
                                                    <p className="text-xs mt-1">You&apos;ll see updates about your orders here</p>
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-bg-soft transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-accent' : ''
                                                            }`}
                                                        onClick={() => {
                                                            markNotificationAsRead(notification.id);
                                                            if (notification.orderId) {
                                                                router.push(`/my-orders/${notification.orderId}`);
                                                                setShowNotifications(false);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-primary' : 'text-gray-700'}`}>
                                                                {notification.message}
                                                            </p>
                                                            {!notification.read && (
                                                                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 ml-2 mt-1"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatNotificationTime(notification.createdAt)}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                        {userDetails ? (
                            <Dropdown
                                userDetails={{
                                    name: userDetails.name ?? '',
                                    email: userDetails.email ?? "",
                                    profileImage: userDetails.profileImage ?? null,
                                }}
                                options={[
                                    {
                                        label: 'Profile',
                                        onClick: () => router.push(`/profile/${userDetails.id}`),
                                        icon: <User2Icon className="w-4 h-4" />,
                                    },
                                    {
                                        label: 'My Orders',
                                        onClick: () => router.push('/my-orders'),
                                        icon: <Cloud className="w-4 h-4" />,
                                    },
                                    {
                                        label: 'Log Out',
                                        onClick: () => setShowLogoutModal(true),
                                        icon: <LogOut className="w-4 h-4" />,
                                    },
                                ]}
                                position="bottom"
                            >
                                <ProfileIcon profileImage={userDetails.profileImage} />
                            </Dropdown>
                        ) : (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 text-base font-medium nav-link px-4 py-2 text-highlight hover:text-bg-white hover:bg-accent rounded-full transition-colors duration-200"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-2 text-primary font-medium bg-highlight nav-link px-4 py-2 hover:text-bg-white hover:bg-accent rounded-full transition-colors duration-200"
                                    >
                                        <UserRoundPlus className="w-5 h-5" />
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    {/* Mobile Navigation (Profile + Notification + Menu) */}
                    <div className="flex items-center lg:hidden space-x-4">
                        {userDetails && (
                            <>
                                {/* Mobile Notification Bell */}
                                <div className="relative mt-1" ref={notificationRef}>
                                    <motion.button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative group cursor-pointer p-2 text-highlight rounded-full transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {hasUnread ? (
                                            <BellDot className="w-5 h-5" />
                                        ) : (
                                            <Bell className="w-5 h-5" />
                                        )}
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-4">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </motion.button>

                                    {/* Mobile Notification Dropdown */}
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="fixed right-4 left-4 mt-2 bg-white rounded-lg shadow-lg border border-border-light z-50 max-h-96 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-border-light">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-primary">
                                                        Notifications
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {unreadCount > 0 && (
                                                            <button
                                                                onClick={handleMarkAllAsRead}
                                                                className="text-sm text-accent hover:text-primary transition-colors"
                                                            >
                                                                Mark all as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="max-h-64 overflow-y-auto">
                                                {notificationsLoading ? (
                                                    <div className="p-4 text-center text-gray-500">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                                                        <p className="mt-2 text-sm">Loading notifications...</p>
                                                    </div>
                                                ) : notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500">
                                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                        <p>No notifications yet</p>
                                                        <p className="text-xs mt-1">You&apos;ll see updates about your orders here</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-bg-soft transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-accent' : ''
                                                                }`}
                                                            onClick={() => {
                                                                markNotificationAsRead(notification.id);
                                                                if (notification.orderId) {
                                                                    router.push(`/my-orders/${notification.orderId}`);
                                                                    setShowNotifications(false);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className={`text-sm ${!notification.read ? 'font-semibold text-primary' : 'text-gray-700'}`}>
                                                                    {notification.message}
                                                                </p>
                                                                {!notification.read && (
                                                                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 ml-2 mt-1"></div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatNotificationTime(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                {/* Mobile Profile Icon */}
                                <div className="relative mt-3" ref={profileRef}>
                                    <Dropdown
                                        userDetails={{
                                            name: userDetails.name ?? '',
                                            email: userDetails.email ?? "",
                                            profileImage: userDetails.profileImage ?? null,
                                        }}
                                        options={[
                                            {
                                                label: 'Profile',
                                                onClick: () => {
                                                    router.push(`/profile/${userDetails.id}`);
                                                    setIsOpen(false);
                                                },
                                                icon: <User2Icon className="w-4 h-4" />
                                            },
                                            {
                                                label: 'My Orders',
                                                onClick: () => {
                                                    router.push('/my-orders');
                                                    setIsOpen(false);
                                                },
                                                icon: <Cloud className="w-4 h-4" />,
                                            },
                                            {
                                                label: 'Log Out',
                                                onClick: () => setShowLogoutModal(true),
                                                icon: <LogOut className="w-4 h-4" />,
                                            },
                                        ]}
                                        position="bottom"
                                    >
                                        <ProfileIcon profileImage={userDetails.profileImage} />
                                    </Dropdown>
                                </div>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <motion.div variants={itemVariants}>
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                whileTap={{ scale: 0.95 }}
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <motion.div
                                    animate={isOpen ? "open" : "closed"}
                                    className="w-6 h-6 flex flex-col justify-center items-center"
                                >
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: 45, y: 6 }
                                        }}
                                        className="w-5 h-0.5 bg-current block transition-all duration-300"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { opacity: 1 },
                                            open: { opacity: 0 }
                                        }}
                                        className="w-5 h-0.5 bg-current block mt-1 transition-all duration-300"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: -45, y: -6 }
                                        }}
                                        className="w-5 h-0.5 bg-current block mt-1 transition-all duration-300"
                                    />
                                </motion.div>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <motion.div
                    variants={mobileMenuVariants}
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    className="lg:hidden overflow-hidden bg-accent rounded-lg mt-2 shadow-soft"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Mobile navigation items */}
                        <div className="pt-4 pb-2 border-t border-highlight">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={isOpen ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                                transition={{ delay: navbar.length * 0.1 }}
                                className="space-y-2"
                            >
                                {userDetails ? (
                                    <>
                                        <Link
                                            href="/upload"
                                            className="block px-3 py-2 rounded-md text-base font-medium nav-link text-highlight hover:text-primary hover:bg-bg-white transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <FontAwesomeIcon icon={faUpload} className='inline mr-3' />
                                            Upload
                                        </Link>
                                        <Link
                                            href="/my-orders"
                                            className="block px-3 py-2 rounded-md text-base font-medium nav-link text-highlight hover:text-primary hover:bg-bg-white transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <FontAwesomeIcon icon={faCloud} className='inline mr-3' />
                                            My Orders
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="block px-3 py-2 rounded-md text-base font-medium nav-link text-highlight hover:text-primary hover:bg-bg-white transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block px-3 py-2 rounded-md text-base font-medium nav-link bg-highlight text-primary hover:bg-accent hover:text-bg-white transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </nav>
            {showLogoutModal && (
                <Modal
                    isOpen={showLogoutModal}
                    onCancel={() => setShowLogoutModal(false)}
                    title="Confirm Logout"
                    description="Are you sure you want to logout?"
                    confirmText="Log Out"
                    cancelText="Cancel"
                    onConfirm={handleLogout}
                    loading={loading}
                    loadingText='Logging out...'
                    icon={<LogOut className="w-6 h-6" />}
                />
            )}
        </>
    );
}