<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">Terms of Service</h3>
              <div class="mt-4 text-sm text-gray-500 max-h-96 overflow-y-auto">
                <h4 class="font-medium text-gray-700 mb-2">1. Service Description</h4>
                <p class="mb-4">Financial Manager is a personal finance tracking application that allows users to track expenses, set budgets, and gain insights into their financial habits.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">2. User Accounts</h4>
                <p class="mb-4">Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">3. Acceptable Use</h4>
                <p class="mb-4">Users agree not to use the service for any illegal purposes or in any way that could damage, disable, or impair the service.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">4. Data Storage</h4>
                <p class="mb-4">User data is stored securely and will be maintained as long as the account is active. Users can delete their data at any time.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">5. Termination</h4>
                <p class="mb-4">We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">6. Disclaimers</h4>
                <p class="mb-4">The service is provided "as is" without warranties of any kind. We are not responsible for any financial decisions made based on the information provided by the application.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">7. Changes to Terms</h4>
                <p class="mb-4">We may modify these terms at any time. Continued use of the service after any modifications indicates acceptance of the modified terms.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'close'): void
}>();
</script>