const menuButton = document.querySelector('#menu-button')
const navMenu    = document.querySelector('#nav-menu')
const navLinks   = document.querySelectorAll('.nav-menu a')

const themeButton = document.querySelector('#theme-button')
const themeIcon   = document.querySelector('#theme-icon')
const savedTheme  = localStorage.getItem('theme')

const GITHUB_USERNAME = 'Beda28'

const projectStatus = document.querySelector('#project-status')
const projectsGrid  = document.querySelector('#projects-grid')
const retryButton   = document.querySelector('#retry-button')

const contactForm  = document.querySelector('#contact-form')
const nameInput    = document.querySelector('#name')
const emailInput   = document.querySelector('#email')
const messageInput = document.querySelector('#message')

const nameError    = document.querySelector('#name-error')
const emailError   = document.querySelector('#email-error')
const messageError = document.querySelector('#message-error')
const formResult   = document.querySelector('#form-result')

const siteHeader      = document.querySelector('.site-header')
const scrollTopButton = document.querySelector('.scroll-top')
const revelElements   = document.querySelectorAll('.reveal')

// 햄버거 버튼
menuButton.addEventListener("click", () => {
    navMenu.classList.toggle('active')
})

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active')
    })
})

// 다크모드
if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark'
    themeIcon.textContent = '☀'
}

themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme

    if (currentTheme === 'dark') {
        document.documentElement.dataset.theme = 'light'

        themeIcon.textContent = '☾'
        localStorage.setItem('theme', 'light')
    }
    else {
        document.documentElement.dataset.theme = 'dark'

        themeIcon.textContent = '☀'
        localStorage.setItem('theme', 'dark')
    }
})

// 깃헙 플젝 연동

const renderProjects = (projects) => {
    projectsGrid.innerHTML = 
        projects.map((project) => {
            const {
                name,
                description,
                language,
                stargazers_count,
                html_url
            } = project;

            return `
                <article class='project-card'>
                    <h3>${name}</h3>
                    <p>${description || '설명이 등록되지 않은 프로젝트입니다.'}</p>

                    <div class='project-meta'>
                        <span>${language || 'Unknown'}</span>
                        <span>★ ${stargazers_count}</span>
                    </div>

                    <a class='project-link' href='${html_url}' target='_blank' rel='noreferrer'>GitHub에서 보기</a>
                </article>                
            `
        }).join('')
}

const loadProjects = async () => {
    projectStatus.hidden      = false;
    projectStatus.textContent = '프로젝트를 불러오는 중...';
    retryButton  .hidden      = true;
    projectsGrid .innerHTML   = '';

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
        );

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const projects = await response.json();

        const visibleProjects =
            projects.filter((project) => {
                return (
                    !project.fork &&
                    !project.archived
                );
            });

        if (visibleProjects.length === 0) {
            projectStatus.textContent = '표시할 프로젝트가 없습니다.';
            return;
        }

        projectStatus.hidden = true;
        renderProjects(visibleProjects.slice(0, 6));
    } catch (error) {
        console.error(error);

        projectStatus.hidden      = false;
        projectStatus.textContent = '프로젝트를 불러올 수 없습니다.';
        retryButton  .hidden      = false;
    }
};

retryButton.addEventListener('click', () => {
    loadProjects()
})

loadProjects()

// 입력 폼
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = () => {
    let valid = true;

    nameError   .textContent = ''
    emailError  .textContent = ''
    messageError.textContent = ''

    const name    = nameInput   .value.trim()
    const email   = emailInput  .value.trim()
    const message = messageInput.value.trim()

    if (name    === '') {
        nameError   .textContent = '이름을 입력해주세요.'
        valid = false;
    }
    if (message === '') {
        messageError.textContent = '메시지를 입력해주세요'
        valid = false;
    }

    if (email   === '') {
        emailError.textContent = '이메일을 입력해주세요.';
        valid = false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = '올바른 이메일 형식이 아닙니다.';
        valid = false;
    }
    return valid;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!validateForm()) {
        formResult.textContent = '입력값을 확인해주세요.'
        return
    }

    formResult.textContent = '입력 확인이 완료되었습니다.'
})

const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea')

formInputs.forEach((input) => {
    input.addEventListener('input', () => {
        validateForm()
        formResult.textContent = ''
    })
})

// 스크롤
window.addEventListener('scroll', () => {
    if (window.scrollY >= 60) siteHeader.classList.add('scrolled')
    else                      siteHeader.classList.remove('scrolled')

    if (window.scrollY >= 300) scrollTopButton.classList.add('visible')
    else                       scrollTopButton.classList.remove('visible')
})

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
})

// 스크롤 애니메이션
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) entry.target.classList.add('visible')
        });
    }, { threshold: 0.2 }
)


revelElements.forEach((element) => {
    observer.observe(element)
})