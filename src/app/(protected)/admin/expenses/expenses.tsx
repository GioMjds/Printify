'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "@/services/Admin";
import { Plus, X, Edit, Trash2, Filter, ChevronDown, ChevronUp, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Expense, ExpenseFormData, ExpenseResponse } from '@/types/Admin';
import { format } from 'date-fns';
import { expensesCategories } from '@/constants/admin-expenses';
import { formatExpenseCategories } from '@/utils/formatters';

export default function ExpensesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    const queryClient = useQueryClient();

    const { data } = useQuery<ExpenseResponse>({
        queryKey: ['expenses'],
        queryFn: fetchExpenses,
    });

    const expenses: Expense[] = data?.expenses || [];

    const addMutation = useMutation({
        mutationFn: addExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            setIsModalOpen(false);
            setEditingExpense(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormData>({
        mode: 'onBlur',
        defaultValues: editingExpense ? {
            expenseName: editingExpense.expenseName,
            amount: editingExpense.amount,
            category: editingExpense.category,
            description: editingExpense.description,
            occuredAt: format(new Date(editingExpense.occuredAt), 'yyyy-MM-dd'),
        } : {}
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const categories = [...new Set(expenses.map(expense => expense.category))];

    const filteredExpenses = expenses.filter(expense => {
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        const matchesDate = dateFilter === 'all' ||
            format(new Date(expense.occuredAt), 'yyyy-MM') === dateFilter;
        return matchesCategory && matchesDate;
    });

    const currentMonth = format(new Date(), 'yyyy-MM');
    const totalThisMonth = expenses
        .filter(exp => format(new Date(exp.occuredAt), 'yyyy-MM') === currentMonth)
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

    const onSubmit = (data: ExpenseFormData) => {
        const expenseData = {
            expenseName: data.expenseName,
            amount: Number(data.amount),
            category: data.category,
            description: data.description,
            occuredAt: data.occuredAt,
        };

        if (editingExpense) {
            updateMutation.mutate({ expenseId: editingExpense.id, ...expenseData });
        } else {
            addMutation.mutate(expenseData);
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
        reset({
            expenseName: expense.expenseName,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            occuredAt: format(new Date(expense.occuredAt), 'yyyy-MM-dd'),
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
        reset();
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h3 className="text-text-light text-sm font-medium">Total Expenses</h3>
                    <p className="text-3xl font-bold text-text mt-2">₱{totalExpenses}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h3 className="text-text-light text-sm font-medium">Expenses This Month</h3>
                    <p className="text-3xl font-bold text-text mt-2">
                        ₱{totalThisMonth}
                    </p>
                </motion.div>
            </div>

            {/* Expense List Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Expense Records</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-bg-soft rounded-lg text-text"
                    >
                        <Filter size={18} />
                        <span>Filters</span>
                        {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-accent text-white rounded-lg"
                    >
                        <Plus size={18} />
                        <span>Add Expense</span>
                    </motion.button>
                </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
                {filtersOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-4 mb-6 rounded-sm overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full p-2 border border-border-light rounded-lg bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light mb-1">Date</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full p-2 border border-border-light rounded-lg bg-white"
                                >
                                    <option value="all">All Dates</option>
                                    {[...new Set(expenses.map(e => format(new Date(e.occuredAt), 'yyyy-MM')))].map(date => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expense List */}
            <div className="rounded-md shadow-xl overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-bg-soft text-text uppercase font-semibold">
                            {['Expense Name', 'Amount', 'Category', 'Occured At', 'Actions'].map(header => (
                                <th key={header} className="px-4 py-3 font-semibold text text-light text-center">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense, index) => (
                            <motion.tr
                                key={expense.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-border-light text-center"
                            >
                                <td className="px-4 py-3 font-medium text-text truncate">{expense.expenseName}</td>
                                <td className="px-4 py-3 text-lg text-text font-semibold">₱{expense.amount}</td>
                                <td className="px-4 py-3">
                                    {(() => {
                                        const { label, icon: Icon, color } = formatExpenseCategories(expense.category);
                                        return (
                                            <span className={`p-3 uppercase font-semibold ${color} rounded-full text-xs text-text`}>
                                                <Icon className="inline-block mr-1" size={25} />
                                                {label}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className="px-4 py-3 text-lg text-text-light">
                                    {format(new Date(expense.occuredAt), 'yyyy/MM/dd')}
                                </td>
                                <td className="px-4 py-3 flex justify-center items-center space-x-2">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 text-accent cursor-pointer hover:bg-accent/10 rounded-full"
                                        >
                                            <Edit size={28} />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate({ expenseId: expense.id })}
                                            className="p-2 text-red-500 cursor-pointer hover:bg-red-500/10 rounded-full"
                                        >
                                            <Trash2 size={28} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <td colSpan={5} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <FileText className="text-text-light mb-2" size={36} />
                                        <span className="text-text-light text-lg font-medium">
                                            No expenses found
                                        </span>
                                    </div>
                                </td>
                            </motion.tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Expense Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                        onClick={(e) => e.target === e.currentTarget && handleModalClose()}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl w-full max-w-md"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-text">
                                        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                                    </h3>
                                    <button
                                        onClick={handleModalClose}
                                        className="text-text-light cursor-pointer hover:text-text"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-light mb-1">
                                            Expense Name
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={18} />
                                            <input
                                                type="text"
                                                {...register('expenseName', { required: 'Expense name is required' })}
                                                className="w-full pl-10 p-2 border border-border-light rounded-lg"
                                                placeholder='Enter expense name'
                                            />
                                        </div>
                                        {errors.expenseName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.expenseName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-light mb-1">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={18} />
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('amount', {
                                                    required: 'Amount is required',
                                                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                                                })}
                                                className="w-full pl-10 p-2 border border-border-light rounded-lg"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-light mb-1">
                                            Category
                                        </label>
                                        <div className="relative">
                                            <select 
                                                {...register('category', { required: 'Category is required' })}
                                                className="w-full p-2 border border-border-light rounded-lg bg-white"
                                            >
                                                {expensesCategories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-light mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            {...register('description')}
                                            className="w-full p-2 border resize-none border-border-light rounded-lg"
                                            rows={3}
                                            placeholder="Additional details about the expense"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-light mb-1">
                                            Occured At
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={18} />
                                            <input
                                                type="date"
                                                {...register('occuredAt', { required: 'Date is required' })}
                                                className="w-full pl-10 p-2 border border-border-light rounded-lg"
                                            />
                                        </div>
                                        {errors.occuredAt && (
                                            <p className="text-red-500 text-sm mt-1">{errors.occuredAt.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <motion.button
                                            type="button"
                                            onClick={handleModalClose}
                                            className="px-4 py-2 cursor-pointer border border-border rounded-lg text-text"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={addMutation.isPending || updateMutation.isPending}
                                            className="px-4 py-2 cursor-pointer bg-accent text-white rounded-lg disabled:opacity-50"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                                            {(addMutation.isPending || updateMutation.isPending) && (
                                                <span className="ml-2">...</span>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}