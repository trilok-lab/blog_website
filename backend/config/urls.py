from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('api/articles/', include('articles.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/stripe/', include('stripe_integration.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
