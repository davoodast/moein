import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import apiClient from '../../lib/apiClient';

interface Employee {
  id: number;
  username: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  status: string;
  start_date: string;
  bank_account: string;
}

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    position: '',
    salary: 0,
    status: 'active',
    start_date: '',
    password: 'password123',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await apiClient.put(`/employees/${editingId}`, updateData);
      } else {
        await apiClient.post('/employees', formData);
      }
      fetchEmployees();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        username: '',
        email: '',
        phone: '',
        position: '',
        salary: 0,
        status: 'active',
        start_date: '',
        password: 'password123',
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('خطا در ذخیره اطلاعات');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('آیا مطمئن هستید؟')) {
      try {
        await apiClient.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      username: employee.username,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      salary: employee.salary,
      status: employee.status,
      start_date: employee.start_date,
      password: '',
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const filteredEmployees = employees.filter(e =>
    e.username.includes(searchQuery) ||
    e.email.includes(searchQuery) ||
    e.position.includes(searchQuery)
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-lg sm:text-2xl font-bold dark:text-white">مدیریت کارمندان</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs sm:text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">افزودن کارمند جدید</span>
          <span className="sm:hidden">کارمند جدید</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="جستجو..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 pr-10 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">نام کاربری</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">ایمیل</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">شماره تلفن</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">سمت شغلی</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="عکاسی، فیلمبرداری، تدوین..."
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">حقوق ماهانه</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">تاریخ شروع</label>
                <input
                  type="text"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="1402/01/01"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 mb-2">وضعیت</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-2">رمز عبور</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                    required
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ذخیره
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table – sm+ */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-right dark:text-gray-300">نام کاربری</th>
              <th className="px-4 py-3 text-right dark:text-gray-300">سمت</th>
              <th className="px-4 py-3 text-right dark:text-gray-300">تلفن</th>
              <th className="px-4 py-3 text-right dark:text-gray-300">حقوق</th>
              <th className="px-4 py-3 text-right dark:text-gray-300">وضعیت</th>
              <th className="px-4 py-3 text-right dark:text-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center dark:text-gray-300">
                  درحال بارگذاری...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center dark:text-gray-300">
                  هیچ کارمندی یافت نشد
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 dark:text-gray-300">{emp.username}</td>
                  <td className="px-4 py-3 dark:text-gray-300">{emp.position}</td>
                  <td className="px-4 py-3 dark:text-gray-300">{emp.phone}</td>
                  <td className="px-4 py-3 dark:text-gray-300">
                    {emp.salary?.toLocaleString() || 0} ت
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      emp.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {emp.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards – mobile */}
      <div className="sm:hidden space-y-3">
        {loading && <p className="text-center text-gray-400 py-6">درحال بارگذاری...</p>}
        {!loading && filteredEmployees.length === 0 && <p className="text-center text-gray-400 py-6">هیچ کارمندی یافت نشد</p>}
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium dark:text-white">{emp.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{emp.position}</p>
                {emp.phone && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{emp.phone}</p>}
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{(emp.salary || 0).toLocaleString()} ت</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    emp.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>{emp.status === 'active' ? 'فعال' : 'غیرفعال'}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleEdit(emp)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
