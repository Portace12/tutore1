<template>
  <div class="min-h-screen bg-base-200">
    <!-- Hero Section -->
    <section
      class="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-16 px-6 md:px-12"
    >
      <div class="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"
          class="max-w-sm rounded-lg shadow-2xl"
          alt="Student"
        />
        <div>
          <h1 class="text-4xl md:text-5xl font-extrabold">Welcome Student 🎓</h1>
          <p class="py-6 text-lg md:text-xl">
            Access to your account, check your grades, and stay up to date with university news.
          </p>
          <router-link to="/login" class="btn btn-accent btn-lg"> login </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="px-6 md:px-12 py-12 grid gap-6 md:grid-cols-3">
      <div class="card bg-base-100 shadow-lg p-6 rounded-2xl">
        <h2 class="card-title text-xl">📚 Courses</h2>
        <p class="text-base-content/70">View and manage all your enrolled courses.</p>
      </div>

      <div class="card bg-base-100 shadow-lg p-6 rounded-2xl">
        <h2 class="card-title text-xl">📝 Results</h2>
        <p class="text-base-content/70">Check your exam results and overall performance.</p>
      </div>

      <div class="card bg-base-100 shadow-lg p-6 rounded-2xl">
        <h2 class="card-title text-xl">📅 Calendar</h2>
        <p class="text-base-content/70">Stay informed with the academic schedule and events.</p>
      </div>
    </section>
  </div>
</template>

<script setup></script>
