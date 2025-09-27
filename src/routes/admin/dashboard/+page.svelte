<div class="max-w-7xl mx-auto p-6 space-y-8">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
    <a href="/admin/logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</a>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <a href="/admin/products" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Products</h2>
      <p class="text-gray-500 mt-1">Add, edit, and remove products.</p>
    </a>
    <a href="/admin/orders" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Orders</h2>
      <p class="text-gray-500 mt-1">Review and update customer orders.</p>
    </a>
    <a href="/admin/users" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Users</h2>
      <p class="text-gray-500 mt-1">View and manage user accounts.</p>
    </a>
  </div>

  <div>
    <a href="/" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
      ← Back to User Interface
    </a>
  </div>
</div>
