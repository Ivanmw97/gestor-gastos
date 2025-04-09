<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">Privacy Policy</h3>
              <div class="mt-4 text-sm text-gray-500 max-h-96 overflow-y-auto">
                <h4 class="font-medium text-gray-700 mb-2">1. Data Collection</h4>
                <p class="mb-4">We collect personal information such as your name, email address, and financial data that you choose to enter into the application.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">2. Data Usage</h4>
                <p class="mb-4">We use your data to provide and improve the service, including generating financial insights and personalized recommendations.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">3. Data Storage</h4>
                <p class="mb-4">Your data is stored securely in our database and is retained as long as your account is active or as needed to provide you services.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">4. Data Sharing</h4>
                <p class="mb-4">We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your financial data remains private.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">5. User Rights</h4>
                <p class="mb-4">You have the right to access, correct, or delete your personal data at any time through your account settings or by contacting us.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">6. Cookies</h4>
                <p class="mb-4">We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookies through your browser settings.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">7. Security Measures</h4>
                <p class="mb-4">We implement a variety of security measures to maintain the safety of your personal information, including encryption and secure database practices.</p>
                
                <h4 class="font-medium text-gray-700 mb-2">8. Contact Information</h4>
                <p class="mb-4">If you have any questions regarding this privacy policy, you may contact us at support@financialmanager.com.</p>
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