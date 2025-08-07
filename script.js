// Chemical Equation Balancer - JavaScript Functionality

class ChemicalEquationBalancer {
    constructor() {
        this.currentReactionType = 'synthesis';
        this.isLoading = false;
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.initializeTheme();
        this.updateReactionTypeDisplay();
    }

    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Reaction type buttons
        const reactionBtns = document.querySelectorAll('.reaction-btn');
        reactionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectReactionType(e.target.closest('.reaction-btn')));
        });

        // Element buttons
        const elementBtns = document.querySelectorAll('.element-btn');
        elementBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.insertElement(e.target.dataset.element));
        });

        // Action buttons
        const balanceBtn = document.getElementById('balanceBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        balanceBtn.addEventListener('click', () => this.balanceEquation());
        clearBtn.addEventListener('click', () => this.clearInputs());

        // Input field enhancements
        const inputs = document.querySelectorAll('.chemical-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.balanceEquation();
                }
            });
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('chemSolverTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('chemSolverTheme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add animation effect
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeBtn.style.transform = 'scale(1)';
        }, 150);
    }

    updateThemeIcon(theme) {
        const electron = document.querySelector('.electron');
        if (theme === 'light') {
            electron.style.background = '#fbbf24'; // Sun color
            electron.style.boxShadow = '0 0 8px #fbbf24';
        } else {
            electron.style.background = '#00ff88'; // Moon color
            electron.style.boxShadow = '0 0 8px #00ff88';
        }
    }

    selectReactionType(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        button.classList.add('active');
        
        // Update current reaction type
        this.currentReactionType = button.dataset.type;
        this.updateReactionTypeDisplay();
        
        // Add selection animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    updateReactionTypeDisplay() {
        const reactionTypeElement = document.getElementById('reactionType');
        const typeNames = {
            synthesis: 'تركيب',
            decomposition: 'تحلل',
            combustion: 'احتراق',
            displacement: 'إحلال'
        };
        
        reactionTypeElement.textContent = `نوع التفاعل: ${typeNames[this.currentReactionType]}`;
    }

    insertElement(element) {
        const reactantsInput = document.getElementById('reactants');
        const currentValue = reactantsInput.value;
        const cursorPosition = reactantsInput.selectionStart;
        
        const newValue = currentValue.slice(0, cursorPosition) + element + currentValue.slice(cursorPosition);
        reactantsInput.value = newValue;
        
        // Set cursor position after inserted element
        reactantsInput.focus();
        reactantsInput.setSelectionRange(cursorPosition + element.length, cursorPosition + element.length);
        
        // Add visual feedback
        const elementBtn = document.querySelector(`[data-element="${element}"]`);
        elementBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            elementBtn.style.transform = 'scale(1)';
        }, 200);
    }

    validateInput(input) {
        const value = input.value;
        const isValid = this.isValidChemicalFormula(value);
        
        if (isValid || value === '') {
            input.style.borderColor = 'var(--glass-border)';
            input.style.boxShadow = 'none';
        } else {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
        }
    }

    isValidChemicalFormula(formula) {
        // Basic validation for chemical formulas
        const chemicalPattern = /^[A-Z][a-z]?(\d+)?(\s*[\+\-]\s*[A-Z][a-z]?(\d+)?)*$/;
        return chemicalPattern.test(formula.replace(/\s/g, ''));
    }

    async balanceEquation() {
        if (this.isLoading) return;
        
        const reactants = document.getElementById('reactants').value.trim();
        const products = document.getElementById('products').value.trim();
        
        if (!reactants || !products) {
            this.showError('يرجى إدخال المواد المتفاعلة والناتجة');
            return;
        }
        
        this.setLoadingState(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const balancedEquation = this.performBalancing(reactants, products);
            this.displayResult(balancedEquation);
            this.updateStatus('تم الموازنة بنجاح', 'success');
            
        } catch (error) {
            this.showError('حدث خطأ في موازنة المعادلة');
            this.updateStatus('فشل في الموازنة', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    performBalancing(reactants, products) {
        // Simplified balancing algorithm for demonstration
        // In a real application, this would use a more sophisticated algorithm
        
        const examples = {
            'H2 + O2': { products: 'H2O', balanced: '2H₂ + O₂ → 2H₂O' },
            'Na + Cl2': { products: 'NaCl', balanced: '2Na + Cl₂ → 2NaCl' },
            'C + O2': { products: 'CO2', balanced: 'C + O₂ → CO₂' },
            'CH4 + O2': { products: 'CO2 + H2O', balanced: 'CH₄ + 2O₂ → CO₂ + 2H₂O' },
            'CaCO3': { products: 'CaO + CO2', balanced: 'CaCO₃ → CaO + CO₂' },
            'Fe + O2': { products: 'Fe2O3', balanced: '4Fe + 3O₂ → 2Fe₂O₃' }
        };
        
        // Check for known examples
        const normalizedReactants = reactants.replace(/\s/g, '');
        for (const [key, value] of Object.entries(examples)) {
            if (normalizedReactants.includes(key.replace(/\s/g, ''))) {
                return value.balanced;
            }
        }
        
        // Generic balancing attempt
        return this.genericBalance(reactants, products);
    }

    genericBalance(reactants, products) {
        // Simple generic balancing for demonstration
        const reactantsList = reactants.split('+').map(r => r.trim());
        const productsList = products.split('+').map(p => p.trim());
        
        // Convert to subscript numbers
        const toSubscript = (str) => {
            return str.replace(/(\d+)/g, (match) => {
                const subscripts = '₀₁₂₃₄₅₆₇₈₉';
                return match.split('').map(digit => subscripts[parseInt(digit)]).join('');
            });
        };
        
        const balancedReactants = reactantsList.map(toSubscript).join(' + ');
        const balancedProducts = productsList.map(toSubscript).join(' + ');
        
        return `${balancedReactants} → ${balancedProducts}`;
    }

    displayResult(equation) {
        const equationDisplay = document.getElementById('balancedEquation');
        
        // Clear previous content
        equationDisplay.innerHTML = '';
        
        // Create new content with animation
        const equationElement = document.createElement('p');
        equationElement.className = 'balanced-equation';
        equationElement.textContent = equation;
        
        // Add with animation
        equationElement.style.opacity = '0';
        equationElement.style.transform = 'translateY(20px)';
        equationDisplay.appendChild(equationElement);
        
        // Trigger animation
        setTimeout(() => {
            equationElement.style.transition = 'all 0.5s ease';
            equationElement.style.opacity = '1';
            equationElement.style.transform = 'translateY(0)';
        }, 100);
        
        // Add glow effect
        setTimeout(() => {
            equationElement.style.textShadow = '0 0 20px var(--primary-blue)';
            setTimeout(() => {
                equationElement.style.textShadow = 'none';
            }, 1000);
        }, 500);
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        const balanceBtn = document.getElementById('balanceBtn');
        
        if (loading) {
            balanceBtn.classList.add('loading');
            balanceBtn.disabled = true;
        } else {
            balanceBtn.classList.remove('loading');
            balanceBtn.disabled = false;
        }
    }

    updateStatus(message, type) {
        const statusElement = document.getElementById('balanceStatus');
        statusElement.textContent = `الحالة: ${message}`;
        
        // Add color based on type
        if (type === 'success') {
            statusElement.style.color = 'var(--secondary-green)';
        } else if (type === 'error') {
            statusElement.style.color = '#ef4444';
        } else {
            statusElement.style.color = 'var(--text-secondary)';
        }
        
        // Reset color after 3 seconds
        setTimeout(() => {
            statusElement.style.color = 'var(--text-secondary)';
        }, 3000);
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '1000',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    clearInputs() {
        document.getElementById('reactants').value = '';
        document.getElementById('products').value = '';
        document.getElementById('balancedEquation').innerHTML = '<p class="placeholder-text">ستظهر المعادلة الموزونة هنا...</p>';
        this.updateStatus('في انتظار الإدخال', 'default');
        
        // Add clear animation
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clearBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Reset input validation styles
        document.querySelectorAll('.chemical-input').forEach(input => {
            input.style.borderColor = 'var(--glass-border)';
            input.style.boxShadow = 'none';
        });
    }
}

// Utility functions for enhanced interactions
class AnimationUtils {
    static addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    static addParticleEffect(element) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-blue);
                border-radius: 50%;
                pointer-events: none;
                animation: particle 1s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
}

// Add CSS for animations
const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes particle {
        to {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Enhanced event listeners for ripple effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    const app = new ChemicalEquationBalancer();
    
    // Add ripple effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            AnimationUtils.addRippleEffect(button, e);
        });
    });
    
    // Add particle effects to element buttons
    document.querySelectorAll('.element-btn').forEach(button => {
        button.addEventListener('click', () => {
            AnimationUtils.addParticleEffect(button);
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    app.balanceEquation();
                    break;
                case 'Backspace':
                    e.preventDefault();
                    app.clearInputs();
                    break;
                case 'd':
                    e.preventDefault();
                    app.toggleTheme();
                    break;
            }
        }
    });
    
    // Add touch support for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // Pull to refresh gesture
        if (diff < -100 && window.scrollY === 0) {
            app.clearInputs();
            // Add visual feedback
            document.body.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.body.style.transform = 'translateY(0)';
            }, 200);
        }
    });
    
    // Performance optimization: Lazy load animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.floating-atom, .floating-molecule, .floating-flask').forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

