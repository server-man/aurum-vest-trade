import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false, // Disable sourcemaps in production for security
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'charts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react']
        },
        
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          
          if (/css/i.test(extType ?? '')) {
            return 'assets/css/[name]-[hash].[ext]';
          }
          
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize asset handling
    assetsInlineLimit: 4096, // 4kb
  },

  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    cors: true
  },

  preview: {
    port: 4173,
    strictPort: true,
    host: '0.0.0.0'
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'recharts',
      'date-fns',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },

  define: {
    __DEV__: false,
    __PROD__: true,
    'process.env.NODE_ENV': '"production"'
  },

  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger']
  },

  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  }
});